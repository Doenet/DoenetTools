type NewsletterConfig = {
  title: string;
  subtitle: string;
  issueDate: Date;
  excerptMarker: string;
  manualOrder: string[];
};

const defaults: NewsletterConfig = {
  title: "Doenet Newsletter",
  subtitle: "Welcome! Here are some recent updates from the Doenet project.",
  issueDate: new Date(),
  excerptMarker: "more",
  manualOrder: [],
};

function parseManualOrder(rawValue: string | undefined): string[] {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    return [];
  }

  return [];
}

function parseIssueDate(rawValue: string | undefined): Date {
  if (!rawValue) return defaults.issueDate;
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return defaults.issueDate;
  return parsed;
}

const env = import.meta.env;

export const newsletterConfig: NewsletterConfig = {
  title: env.NEWSLETTER_TITLE || defaults.title,
  subtitle: env.NEWSLETTER_SUBTITLE || defaults.subtitle,
  issueDate: parseIssueDate(env.NEWSLETTER_ISSUE_DATE),
  excerptMarker: env.NEWSLETTER_EXCERPT_MARKER || defaults.excerptMarker,
  manualOrder: parseManualOrder(env.NEWSLETTER_MANUAL_ORDER),
};
