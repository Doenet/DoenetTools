import express from "express";
import { handleErrors } from "../errors/routeErrorHandler";
import type { FeatureFlagsResponse } from "@doenet-tools/shared";
import { getFeatureFlags } from "./featureFlags.service";

export const featureFlagsRouter = express.Router();

// Public and read-only: the client needs flags before it knows who is logged in,
// and flags gate unreleased UI, not access to data — anything that must stay
// private is still enforced server-side. Writes happen through the
// `feature-flag` CLI, never over HTTP. See ./README.md.
featureFlagsRouter.get("/", async (_req, res) => {
  try {
    const flags = await getFeatureFlags();
    // Short client-side cache: a browser tab picks up a flip within ~a minute
    // (on its next load or poll) without hammering the API on every navigation.
    res.set("Cache-Control", "public, max-age=15");
    const body: FeatureFlagsResponse = { flags };
    res.json(body);
  } catch (e) {
    handleErrors(res, e);
  }
});
