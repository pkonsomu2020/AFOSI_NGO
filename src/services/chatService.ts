import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ---------------------------------------------------------------------------
// Static AFOSI knowledge base (always included)
// ---------------------------------------------------------------------------
const AFOSI_BASE_PROMPT = `You are Afosi, a friendly and knowledgeable assistant for the AFOSI NGO website. Help visitors learn about AFOSI's mission, programs, team, impact, and how to get involved.

## About AFOSI
AFOSI (Action For Sustainability Initiative) is a Nairobi-based NGO with 12+ years of experience empowering youth in Kenya and East Africa. AFOSI works across five pillars: Health, Education, Environment, Leadership, and Livelihoods.

**Mission:** To empower youth and communities to drive sustainable change.
**Impact to date:** 350,000+ beneficiaries reached · 846+ jobs created · 151+ youth enterprises supported · 5,000+ tons of plastic waste reduced.

## Five Pillars
1. **Health** – Youth health education, mental wellness, and reproductive health
2. **Education** – Learning support, mentorship, and academic programmes
3. **Environment** – Climate action, conservation, and sustainability
4. **Leadership** – Civic engagement, governance, and youth empowerment
5. **Livelihoods** – Enterprise development, skills training, and job creation

## Programs & Initiatives
- **Sheria ya Vijana** – Youth legal empowerment and civic education
- **M.A.T.H** – Mathematics and mentorship programme for secondary students
- **Youth Voices Lab** – Journalism, storytelling, and media skills for young people
- **YOMA Projects** – Youth agency and skills development via the YOMA digital platform
- **Kiongozi Platform** – Digital leadership development tool for youth
- **Kenya Youth Climate Hub (KYCH)** – Youth-led climate action and environmental advocacy
- **Flare Hub** – Innovation and entrepreneurship incubator for young people
- **We Lead Project** – Leadership and civic engagement for young women
- **Robotics & Coding** – STEM education and digital literacy for youth

## Team

### Board Members
- **Eva Nchogu** – Board Chairperson
- **Winnie Osoro** – Board Treasurer
- **Lucy Mogesi** – Board Member
- **Anne Nderitu** – Board Member

### Management Team
- **Eric Nyamwaro** – Executive Director
- **Esther Mwikali** – National Coordinator

### Core Team
- **Fredrick Ongaki** – MEAL Specialist
- **Davin Omollo** – Project Associate
- **Vanessa Wambui** – Data Specialist
- **Prisca Achieng** – Program Assistant
- **Ivy Awuor** – Programs
- **Elisha Papa** – IT Specialist
- **Virginia Kerubo** – Communications Lead
- **Magdaline Watahi** – Programs
- **Elizabeth Muthoni** – Finance Officer

## Contact
- **Address:** Manga Hse, Kiambere RD, Upper Hill, Nairobi, Kenya
- **Phone:** (+254) 0115963306
- **Email:** info@afosi.org
- **Website:** afosi.org

## Site Pages
- **Homepage** – / (overview of everything)
- **Opportunities** – /opportunities (jobs, internships, volunteering)
- **Gallery** – /gallery (photos from our work)
- **News** – /news (latest updates and articles)
- **Projects** – /projects (detailed project pages)
- **We Lead Project** – /programs/we-lead
- **Robotics & Coding** – /programs/robotics-coding

## Your database access
You have real-time access to AFOSI's live database. Every message fetches the latest data, appended below under "Live Data from AFOSI Database". This includes active opportunities, published news, and projects. Always use this data to give accurate, specific answers - cite titles, deadlines, and details directly. Do not say you cannot access the database.

## Your behaviour
- Be warm, concise, and encouraging. You represent AFOSI's values.
- Always prefer live data over assumptions when answering about opportunities, news, or projects.
- If something genuinely isn't available, direct the visitor to info@afosi.org or (+254) 0115963306.
- Use markdown for clarity (bold names, bullet lists, links). Keep responses focused and human.
- Link to internal pages using React Router paths (e.g. [View Opportunities](/opportunities)) when relevant.`;

// ---------------------------------------------------------------------------
// Fetch live context from Supabase public tables
// ---------------------------------------------------------------------------
async function fetchLiveContext(): Promise<string> {
  const sections: string[] = [];

  try {
    // Opportunities (active only)
    const { data: opps } = await supabase
      .from("opportunities")
      .select("title, type, description, location, duration, deadline, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (opps && opps.length > 0) {
      const lines = opps.map((o) =>
        `- **${o.title}** (${o.type}) | ${o.location ?? "Kenya"} | Deadline: ${o.deadline ?? "Open"}\n  ${o.description ?? ""}`
      );
      sections.push(`## Active Opportunities\n${lines.join("\n")}`);
    }
  } catch {
    // silently skip if table doesn't exist or RLS blocks
  }

  try {
    // Latest published news
    const { data: news } = await supabase
      .from("news")
      .select("title, category, summary, published_date, slug")
      .eq("is_published", true)
      .order("published_date", { ascending: false })
      .limit(10);

    if (news && news.length > 0) {
      const lines = news.map((n) =>
        `- **${n.title}** (${n.category ?? "News"}) - ${n.summary ?? ""} [${n.published_date ?? ""}]`
      );
      sections.push(`## Recent News\n${lines.join("\n")}`);
    }
  } catch {
    // silently skip
  }

  try {
    // Projects
    const { data: projects } = await supabase
      .from("projects")
      .select("title, description, status, category")
      .order("created_at", { ascending: false })
      .limit(15);

    if (projects && projects.length > 0) {
      const lines = projects.map((p) =>
        `- **${p.title}** [${p.status ?? "Active"}] - ${p.description ?? ""}`
      );
      sections.push(`## Projects\n${lines.join("\n")}`);
    }
  } catch {
    // silently skip
  }

  try {
    // Gallery categories/items (titles only to save tokens)
    const { data: gallery } = await supabase
      .from("gallery")
      .select("title, category, description")
      .order("created_at", { ascending: false })
      .limit(20);

    if (gallery && gallery.length > 0) {
      const lines = gallery.map((g) =>
        `- **${g.title}** (${g.category ?? "General"})${g.description ? ` - ${g.description}` : ""}`
      );
      sections.push(`## Gallery\n${lines.join("\n")}`);
    }
  } catch {
    // silently skip
  }

  if (sections.length === 0) return "";
  return `\n\n---\n## Live Data from AFOSI Database\n${sections.join("\n\n")}`;
}

// ---------------------------------------------------------------------------
// Main export - all keys come from env, nothing hardcoded
// ---------------------------------------------------------------------------
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_OPENAI_API_KEY is not set in .env");

  const liveContext = await fetchLiveContext();
  const systemPrompt = AFOSI_BASE_PROMPT + liveContext;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a response.";
}
