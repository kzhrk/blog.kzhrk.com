import { NextResponse } from "next/server";
import { buildChatbotCorpus } from "@/lib/chatbotCorpus";

export const dynamic = "force-static";

export async function GET() {
	const corpus = await buildChatbotCorpus();
	return NextResponse.json(corpus);
}
