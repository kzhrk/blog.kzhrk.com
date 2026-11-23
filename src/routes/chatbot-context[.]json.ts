import { createFileRoute } from "@tanstack/react-router";
import { buildChatbotCorpus } from "@/lib/chatbotCorpus";

export const Route = createFileRoute("/chatbot-context.json")({
	server: {
		handlers: {
			GET: async () => Response.json(await buildChatbotCorpus()),
		},
	},
});
