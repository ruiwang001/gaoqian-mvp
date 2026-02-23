type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function kimiChatJSON<T>({
  system,
  user,
  schemaHint,
}: {
  system: string;
  user: string;
  schemaHint: string;
}): Promise<T> {
  const apiKey = process.env.MOONSHOT_API_KEY;
  const base = process.env.MOONSHOT_API_BASE || "https://api.moonshot.cn/v1";
  const model = process.env.KIMI_MODEL || "moonshot-v1-32k";

  if (!apiKey) throw new Error("Missing MOONSHOT_API_KEY");

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    {
      role: "user",
      content:
        `${user} ` +
        `IMPORTANT: Return ONLY valid JSON. No markdown, no extra text. ` +
        `JSON schema: ${schemaHint}`,
    },
  ];

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature: 0.4 }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kimi API error: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string")
    throw new Error("Invalid Kimi response");

  try {
    return JSON.parse(content) as T;
  } catch {
    // 兜底：尝试截取 JSON
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(content.slice(start, end + 1)) as T;
    }
    throw new Error("Failed to parse JSON from Kimi response");
  }
}