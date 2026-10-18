/** Shared browser/server redaction. A best-effort filter, not a guarantee of anonymity. */
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type RedactionCategory = "email" | "phone" | "address" | "handle" | "url" | "secret" | "identity";
export type SanitizedText = { text: string; redacted: boolean; categories: RedactionCategory[] };

export const PRIVACY_NOTICE = "Do not share your real name, school, contact details, location, passwords or health records. EngiQuest removes common contact patterns before sending, but this filter can miss personal information. Send engineering questions only.";
export const AI_DISCLOSURE = "AI mode sends your filtered question, up to eight recent filtered messages, and the selected activity's written guidance to OpenAI. Your profile, photos, CAD files and progress are not sent. AI can make mistakes; check its suggestions with the activity guide and a trusted adult.";

export function sanitizeContactDetails(value: string): SanitizedText {
  let text = value.normalize("NFKC")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "");
  const categories = new Set<RedactionCategory>();
  const redact = (pattern: RegExp, category: RedactionCategory) => {
    text = text.replace(pattern, () => { categories.add(category); return `[${category} removed]`; });
  };
  // Explicit disclosures are removed as a clause, including non-US address forms.
  redact(/\b(?:my\s+(?:home\s+|mailing\s+)?address\s*(?:is|:|=)|i\s+live\s+at)\s*[^\r\n;!?]{1,220}/gi, "address");
  redact(/\b(?:my\s+(?:full\s+)?name\s*(?:is|:|=)|i\s+(?:attend|go\s+to)\s+(?:school\s+at\s+)?)\s*[^\r\n;!?]{1,140}/gi, "identity");
  redact(/\b[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+\b/gi, "email");
  redact(/\b[A-Z0-9._%+-]+\s*(?:\[at\]|\(at\)|\bat\b)\s*[A-Z0-9-]+(?:\s*(?:\[dot\]|\(dot\)|\bdot\b|\.)\s*[A-Z0-9-]+)+\b/gi, "email");
  redact(/\b(?:https?|ftp):\/\/[^\s<>]+|\bwww\.[^\s<>]+/gi, "url");
  redact(/\b(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,24}\b(?:\/[^\s<>]*)?/gi, "url");
  // Street suffixes cover common English-language postal addresses; explicit-disclosure rule above is broader.
  redact(/\b\d{1,6}(?:[-/]\d{1,6})?\s+(?:[A-Z0-9][A-Z0-9.'-]*\s+){0,6}(?:street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|court|ct|way|place|pl|terrace|ter|circle|cir|parkway|pkwy|highway|hwy)\b\.?(?:[ ,]+(?:apt\.?|apartment|unit|suite|#)\s*[A-Z0-9-]+)?(?:,\s*[A-Z .'-]{1,50},?\s+[A-Z]{2}\s+\d{5}(?:-\d{4})?)?/gi, "address");
  redact(/\bP\.?\s*O\.?\s+Box\s+\d+[A-Z0-9-]*(?:,\s*[A-Z .'-]{1,50},?\s+[A-Z]{2}\s+\d{5}(?:-\d{4})?)?/gi, "address");
  text = text.replace(/\+?\d[\d\s().-]{5,}\d(?:\s*(?:ext\.?|extension|x)\s*\d{1,6})?/gi, candidate => {
    const digits = candidate.replace(/\D/g, "").length;
    if (digits < 7) return candidate;
    categories.add("phone"); return "[phone removed]";
  });
  redact(/(^|[^\w])@[A-Z0-9_][A-Z0-9_.-]{0,63}/gi, "handle");
  redact(/\b(?:instagram|snapchat|tiktok|discord|username|handle)\s*(?:is|:|=)\s*[^\s,;!?]{1,80}/gi, "handle");
  redact(/\bsk-[A-Z0-9_-]{12,}\b|\b(?:password|api[_ ]?key|access[_ ]?code)\s*(?:is|:|=)\s*[^\s,;!?]{1,160}/gi, "secret");
  return { text: text.trim(), redacted: categories.size > 0, categories: [...categories] };
}

export function sanitizeMessageHistory(history: readonly ChatMessage[]): { history: ChatMessage[]; redacted: boolean } {
  let redacted = false;
  const clean = history.map(message => {
    const sanitized = sanitizeContactDetails(message.content);
    redacted ||= sanitized.redacted;
    return { role: message.role, content: sanitized.text };
  });
  return { history: clean, redacted };
}

/** Run before setState or any optional local persistence; never retain a separate raw copy. */
export function prepareClientMessage(content: string): SanitizedText {
  const sanitized = sanitizeContactDetails(content);
  return { ...sanitized, text: sanitized.text.slice(0, 1600) };
}

/** Convenience alias for existing UI text sanitization calls. */
export function redactContactDetails(content: string): string { return sanitizeContactDetails(content).text; }
