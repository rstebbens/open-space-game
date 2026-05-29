

export const TOPIC_CARDS = [
  {
    type: "Strategic Topic",
    title: "Roadmap vs Reality",
    prompt: "Where is the plan drifting furthest from what is actually happening?",
  },
  {
    type: "Strategic Topic",
    title: "Annual Planning vs Quarterly Learning",
    prompt: "Are we planning too far ahead, or not learning fast enough?",
  },
  {
    type: "Strategic Topic",
    title: "Scaling Agile Without the Chaos",
    prompt: "What helps us grow without turning agility into bureaucracy?",
  },
  {
    type: "Strategic Topic",
    title: "Value Focus",
    prompt: "Where are we busy, but not clearly creating value?",
  },
  {
    type: "Strategic Topic",
    title: "Trust in Teams",
    prompt: "What would we stop controlling if we trusted teams more?",
  },
  {
    type: "Strategic Topic",
    title: "Decision Bottlenecks",
    prompt: "Where do decisions slow down delivery?",
  },
  {
    type: "Team Topic",
    title: "Backlog or Black Hole",
    prompt: "How do we prevent our backlog from becoming a dumping ground?",
  },
  {
    type: "Team Topic",
    title: "Are Daily Stand-ups Just Agile Theatre?",
    prompt: "What makes our daily conversations useful or useless?",
  },
  {
    type: "Team Topic",
    title: "Tools Slowing Us Down",
    prompt: "Where is the tool helping, and where is it getting in the way?",
  },
  {
    type: "Team Topic",
    title: "No Scrum, No Kanban, Still Agile?",
    prompt: "What behaviours matter more than the framework name?",
  },
  {
    type: "Team Topic",
    title: "Definition of Done",
    prompt: "Where does work look finished before it really is?",
  },
  {
    type: "Team Topic",
    title: "Hidden Work",
    prompt: "What important work is invisible until it becomes a problem?",
  },
];

export function normaliseTopic(topic) {
  return String(topic || "").trim().replace(/\s+/g, " ");
}

export function dedupeTopics(topics) {
  const seen = new Set();

  return topics.filter((topic) => {
    const candidate = String(topic || "").trim();

    if (!candidate) {
      return false;
    }

    const normalized = candidate.toLowerCase();

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

export function parsePastedTopics(input) {
  if (!input || typeof input !== "string") {
    return [];
  }

  const topics = input
    .split("\n")
    .map(normaliseTopic)
    .filter(Boolean)
    .map((topic) => (topic.length > 140 ? topic.slice(0, 140) : topic));

  return dedupeTopics(topics).slice(0, 50);
}

export function makeCustomTopicCards(customTopics = []) {
  return (customTopics || []).map((title) => ({
    type: "Custom Topic",
    title,
    prompt: "",
  }));
}

export function shuffleTopics(customTopics = []) {
  if (customTopics && customTopics.length > 0) {
    return makeCustomTopicCards(customTopics).sort(() => Math.random() - 0.5);
  }

  return [...TOPIC_CARDS].sort(() => Math.random() - 0.5);
}