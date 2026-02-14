const RULES = {
  school_name: "Demo Academy",
  fallback:
    "I can help with interior rules for hallways, classrooms, library, cafeteria, labs, and safety areas.",
  rules: [
    {
      title: "Hallway behavior",
      keywords: ["hallway", "corridor", "run", "running", "noise"],
      answer:
        "Walk at all times, keep voices low, and stay to the right side of the hallway.",
    },
    {
      title: "Classroom conduct",
      keywords: ["class", "classroom", "phone", "teacher", "talking"],
      answer:
        "Be on time, follow teacher directions, keep phones away unless permitted, and speak one at a time.",
    },
    {
      title: "Library expectations",
      keywords: ["library", "book", "study", "quiet"],
      answer:
        "Use whisper voices, handle materials carefully, and return books to the proper area.",
    },
    {
      title: "Cafeteria rules",
      keywords: ["cafeteria", "lunch", "food", "table", "trash"],
      answer:
        "Wait your turn in line, remain seated while eating, and clean your space before leaving.",
    },
  ],
};

const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("question-input");
const titleEl = document.getElementById("school-title");
const topicsEl = document.getElementById("topics");
const fileInputEl = document.getElementById("rules-file");

let activeRules = structuredClone(RULES);

renderRules(activeRules);
addMessage("bot", "Hi! Ask me anything about school interior rules.");

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = inputEl.value.trim();
  if (!question) {
    return;
  }

  addMessage("user", question);
  addMessage("bot", getResponse(question));
  inputEl.value = "";
  inputEl.focus();
});

fileInputEl.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const loadedRules = await parseRulesFile(file);
    activeRules = loadedRules;
    renderRules(activeRules);
    addMessage("bot", `Loaded ${activeRules.rules.length} rules from ${file.name}.`);
  } catch (error) {
    addMessage("bot", `Could not load file: ${error.message}`);
  }
});

function renderRules(config) {
  titleEl.textContent = `${config.school_name} Interior Rules Bot`;
  topicsEl.replaceChildren();

  for (const rule of config.rules) {
    const li = document.createElement("li");
    li.textContent = rule.title;
    topicsEl.append(li);
  }
}

function getResponse(question) {
  const text = question.toLowerCase();
  let bestRule = null;
  let bestScore = 0;

  for (const rule of activeRules.rules) {
    const score = rule.keywords.reduce(
      (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
      0,
    );

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return bestRule ? bestRule.answer : activeRules.fallback;
}

function addMessage(role, text) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.textContent = text;
  chatEl.append(item);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function parseRulesFile(file) {
  if (typeof XLSX === "undefined") {
    throw new Error("Excel parser failed to load. Refresh and try again.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const rules = rows
    .map((row) => ({
      title: String(row.title || "").trim(),
      keywords: String(row.keywords || "")
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase())
        .filter(Boolean),
      answer: String(row.answer || "").trim(),
    }))
    .filter((rule) => rule.title && rule.answer && rule.keywords.length > 0);

  if (rules.length === 0) {
    throw new Error("No valid rows found. Check columns: title, keywords, answer.");
  }

  return {
    school_name: "Your School",
    fallback:
      "I couldn't find a matching rule. Ask about one of the uploaded topics.",
    rules,
  };
}
