import { ENGINEERING_CONTEXT } from "./engibot-catalog";
import { sanitizeContactDetails } from "./privacy";

export const ENGINEERING_FIELDS = ["all", "mechanical", "civil", "electrical", "robotics", "biomedical", "green"] as const;
export type EngineeringField = typeof ENGINEERING_FIELDS[number];
export type ActivityKind = "lab" | "project" | "cad";
export type ContextSelection = { field?: EngineeringField; activityKind?: ActivityKind; activityId?: string };
export type ActivityGuide = { id: string; kind: ActivityKind; field: Exclude<EngineeringField, "all">; title: string; summary: string; guidance: string[]; safety: string[] };
export type SafeActivityContext = { field: EngineeringField; activityId?: string; activityKind?: ActivityKind; title?: string; summary?: string; guidance: string[]; safety: string[] };

export function resolveActivityContext(selection: ContextSelection = {}): SafeActivityContext | null {
  const field = selection.field ?? "all";
  if (!selection.activityId) return { field, guidance: [], safety: [] };
  const item = ENGINEERING_CONTEXT.find(candidate => candidate.id === selection.activityId && candidate.kind === selection.activityKind);
  if (!item || (field !== "all" && item.field !== field)) return null;
  const clean = (value: string) => sanitizeContactDetails(value).text.slice(0, 900);
  return { field: item.field, activityId: item.id, activityKind: item.kind, title: clean(item.title), summary: clean(item.summary), guidance: item.guidance.slice(0, 5).map(clean), safety: item.safety.slice(0, 4).map(clean) };
}

export function writtenGuide(context: SafeActivityContext, reason = "AI is not configured."): string {
  const intro = `Written-guide mode — ${reason} No AI provider was contacted.`;
  if (!context.title) return `${intro}\n\nChoose a lab, at-home project or CAD quest to see its written hints. Start by reading the objective, change one variable at a time, and compare your result with the stated model assumptions. For hands-on builds, ask an adult to review the materials and safety instructions first.`;
  const steps = context.guidance.map((step, index) => `${index + 1}. ${step}`).join("\n");
  const safety = context.safety.length ? `\n\nSafety: ${context.safety.join(" ")}` : "\n\nThese are learning models, not construction, medical or manufacturing certifications.";
  return `${intro}\n\n${context.title}\n${context.summary}\n\n${steps}${safety}`;
}

/** A small conservative screen for common unsafe classroom requests; not a general moderation service. */
export function writtenSafetyResponse(message: string): string | null {
  if (/\b(?:suicid\w*|self[- ]harm|kill myself|hurt myself)\b/i.test(message)) return "Written safety guidance — You deserve support from a person who can help right now. Please tell a trusted adult immediately, such as a parent, teacher or school counselor. If you are in immediate danger, contact your local emergency service. EngiBot is an engineering learning guide and cannot provide crisis care.";
  if (/\b(?:wall\s+(?:outlet|socket)|mains\s+(?:power|electricity)|(?:120|230|240)\s*(?:v|volt))\b/i.test(message)) return "Written safety guidance — Keep this project on its specified low-voltage classroom supply. Do not connect a homemade circuit to a wall outlet or mains wiring. Ask an adult to check the kit's voltage, current limit and wiring before continuing.";
  if (/\b(?:drink|taste|potable)\b[\s\S]{0,100}\b(?:filter|water)\b|\b(?:filter|water)\b[\s\S]{0,100}\b(?:drink|taste|potable)\b/i.test(message)) return "Written safety guidance — Never drink or taste water from an experimental filter. Clear-looking water can still contain microbes or dissolved contaminants. Use the activity only to compare visible particles and flow, label it NOT FOR DRINKING, and ask an adult to help with cleanup.";
  if (/\b(?:connect|attach|wire|electrode)\b[\s\S]{0,90}\b(?:body|skin|chest|heart|person)\b/i.test(message)) return "Written safety guidance — Do not connect homemade electronics to anyone's body. Use the lab's synthetic signal or a tabletop model, and ask a teacher to help you explore the idea safely. EngiQuest does not provide medical devices or diagnosis.";
  if (/\b(?:hard|metal|stone|sharp)\s+(?:projectile|ammo|ammunition)|\b(?:explosive|gunpowder|weapon)\b/i.test(message)) return "Written safety guidance — Use only the small soft classroom materials named in the project and its adult-supervised test area. EngiBot cannot help make weapons, explosives or hard-projectile launchers. We can explore force and energy using a safe simulation instead.";
  return null;
}
