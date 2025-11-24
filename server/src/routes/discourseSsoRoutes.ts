import express, { Request, Response } from "express";
import base64url from "base64url";
import crypto from "crypto";

const DISCOURSE_SSO_SECRET = process.env.DISCOURSE_SSO_SECRET!; // Keep this secret!

export const discourseRouter = express.Router();

function hmacSha256Hex(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// Parse base64url and extract payload
function parseSsoPayload(sso: string) {
  return Object.fromEntries(new URLSearchParams(base64url.decode(sso)));
}

// Build payload and sign
function buildSsoResponse(
  params: Record<string, string>,
  secret: string,
): { sso: string; sig: string } {
  const payload = new URLSearchParams(params).toString();
  const sso = base64url.encode(payload);
  const sig = hmacSha256Hex(sso, secret);
  return { sso, sig };
}

discourseRouter.get("/sso", (req: Request, res: Response): void => {
  const { sso, sig } = req.query as { sso?: string; sig?: string };
  if (!sso || !sig) {
    res.status(400).send("Missing sso or sig");
    return;
  }

  // 1. Verify signature
  const expectedSig = hmacSha256Hex(sso, DISCOURSE_SSO_SECRET);
  if (expectedSig !== sig) {
    res.status(400).send("Bad sig");
    return;
  }

  // 2. Check authentication
  if (!req.isAuthenticated?.() || !req.user) {
    // Not logged in, redirect to login (with returnTo to get back here)
    res.redirect("/login?returnTo=" + encodeURIComponent(req.originalUrl));
    return;
  }

  // 3. Prepare response payload per Discourse requirements
  const decoded = parseSsoPayload(sso);
  const nonce = decoded.nonce as string;
  if (!nonce) {
    res.status(400).send("Missing nonce");
    return;
  }

  const user = {
    id: req.user.userId,
    email: req.user.email,
    // email: string;
    // username: string;
    // name?: string;
    // avatarUrl?: string;
  };

  const payload: Record<string, string> = {
    nonce,
    external_id: user.id.toString(),
    email: user.email,
    // username: user.username,
    // name: user.name || user.username,
    // avatar_url: user.avatarUrl || "",
    // Add more fields as needed
  };

  // 4. Encode and sign
  const { sso: ssoResp, sig: respSig } = buildSsoResponse(
    payload,
    DISCOURSE_SSO_SECRET,
  );

  // 5. Redirect back to Discourse
  const returnUrl = decoded.return_sso_url as string;
  if (!returnUrl) {
    res.status(400).send("Missing return_sso_url");
    return;
  }

  res.redirect(
    `${returnUrl}?sso=${encodeURIComponent(ssoResp)}&sig=${respSig}`,
  );
});
