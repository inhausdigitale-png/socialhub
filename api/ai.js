const OpenAI = require("openai");

function fallback(action, body) {
  const topic = body.topic || body.brief || "Social Hub Studio";
  if (action === "hashtags") {
    return {
      hashtags: [
        "#SocialMediaManagement",
        "#ContentWorkflow",
        "#AgencyTools",
        "#AISaaS",
        "#SocialHub"
      ]
    };
  }
  if (action === "idea") {
    return {
      title: `${topic} content idea`,
      hook: `Stop scrolling if you are planning ${String(topic).toLowerCase()}.`,
      angle: "Use one clear problem, one proof point, and one simple next step.",
      caption: `${topic} becomes easier when your content workflow is clear, approved, and scheduled from one place.`,
      cta: "Ask for the checklist.",
      hashtags: ["#ContentIdea", "#SocialHub", "#AISocialMedia"],
      score: "88%"
    };
  }
  return {
    caption:
      "Launch week is almost here. Social Hub helps teams create content, get approvals, schedule posts, and publish across every social app from one simple workspace.",
    firstComment: "Comment STUDIO and we will share the workflow checklist.",
    cta: "Create your next approved post today.",
    hashtags: ["#SocialMediaManagement", "#ContentWorkflow", "#AgencyTools"]
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const action = req.body?.action || "caption";

  if (!apiKey) {
    res.status(200).json(fallback(action, req.body || {}));
    return;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const body = req.body || {};
    const brief = body.brief || body.topic || "Social Hub Studio social media post";
    const platforms = Array.isArray(body.platforms) ? body.platforms.join(", ") : "all selected platforms";
    const contentType = body.contentType || body.format || "Post";

    const prompt =
      action === "hashtags"
        ? `Generate 8 strong hashtags for ${platforms}. Brief: ${brief}`
        : action === "idea"
          ? `Create a social media content idea for topic "${body.topic}", format "${body.format}", audience "${body.audience}".`
          : `Create a ${contentType} caption for ${platforms}. Brief: ${brief}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a senior social media strategist. Return only valid JSON. Use concise premium SaaS tone."
        },
        {
          role: "user",
          content:
            action === "hashtags"
              ? `${prompt} Return JSON: {"hashtags":["#tag"]}`
              : action === "idea"
                ? `${prompt} Return JSON: {"title":"","hook":"","angle":"","caption":"","cta":"","hashtags":["#tag"],"score":"94%"}`
                : `${prompt} Return JSON: {"caption":"","firstComment":"","cta":"","hashtags":["#tag"]}`
        }
      ]
    });

    const text = completion.choices?.[0]?.message?.content || "{}";
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    res.status(200).json({
      ...fallback(action, req.body || {}),
      warning: "OpenAI request failed, fallback content returned."
    });
  }
};
