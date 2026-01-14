const SYSTEM_PROMPT = `You are a calm, empathetic AI companion.
You listen carefully and never judge.
You always acknowledge the user’s emotions first.
You speak briefly, warmly, and human-like.
You ask gentle follow-up questions.
You automatically detect the user’s language and reply in the same language (Hindi, English, or Hinglish).
You are NOT a therapist or doctor.
If the user expresses self-harm or extreme distress, respond with care and encourage reaching out to trusted people or helplines.`;

async function callChatModel({ messages }) {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || (provider === "openrouter" ? "openai/gpt-4o-mini" : "gpt-4o-mini");

  if (!apiKey) {
    throw new Error("Missing AI_API_KEY");
  }

  const baseUrl =
    provider === "openrouter"
      ? "https://openrouter.ai/api/v1"
      : (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1");

  const url = `${baseUrl}/chat/completions`;

  const payload = {
    model,
    temperature: 0.7,
    max_tokens: 220,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // OpenRouter recommended headers (optional)
  if (provider === "openrouter") {
    if (process.env.OPENROUTER_SITE_URL) headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
    if (process.env.OPENROUTER_APP_NAME) headers["X-Title"] = process.env.OPENROUTER_APP_NAME;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI request failed: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty AI response");
  return content;
}

module.exports = { callChatModel, SYSTEM_PROMPT };

