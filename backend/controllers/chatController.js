import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API });

let msgs = [
	{
        role: "system",
        content: `You are an expert AI assistant specializing in Biosafety and bio-related fields. You provide clear, precise, and authoritative responses to questions related to Biosafety protocols, Biohazards, GMOs (Genetically Modified Organisms), biosafety levels (BSL-1 to BSL-4), biosafety cabinets (BSC), and safe laboratory practices. You also offer guidance on research ethics, containment procedures, risk assessments, and biosafety audits in laboratory and industrial settings. Your answers are factual, concise, and based on established biosafety standards such as WHO, NIH, and CDC guidelines. Only answer questions that fall within these domains. If a question is outside this scope, politely guide the user back to biosafety-related topics. Limit your response to 150 words at maximum. Be professional, no need to add formatting elements like * in the response.`
    },    
	{
		role: "system",
		content: "Namaste! How can I assist you today?",
	},
];

export const converseWithAI = async (req, res) => {
	const { message } = req.body;
	if (!message) return res.status(400).json({ error: "Message required" });

	msgs.push({ role: "user", content: message });

	try {
		const response = await groq.chat.completions.create({
			messages: msgs,
			model: "llama3-8b-8192",
		});

		const reply = response.choices[0].message.content;
		return res.json({ reply });
	} catch (err) {
		console.error("Groq error:", err);
		return res.status(500).json({ error: "AI error" });
	}
};

export const clearChatContext = (_req, res) => {
	msgs = msgs.slice(0, 2);
	res.json({ message: "Context cleared" });
};
