import { createEngiBotHandlers } from "../../../lib/engibot-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const handlers = createEngiBotHandlers();

export async function GET() { return handlers.GET(); }
export async function POST(request: Request) { return handlers.POST(request); }
