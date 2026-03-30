const fallbackAchievements = [
  "2023 Eesti Noorte Karikasari – Motohobi ATV Hiinakas 1. koht",
  "2023 Äksi Motocross Cup – Motohobi ATV Hiinakas 1. koht",
  "2024 Eesti Noorte Karikasari – ATV Lapsed Junior 1. koht",
  "2024 Äksi Motocross Cup – ATV Lapsed Junior 1. koht",
  "2025 Äksi Motocross Cup – ATV Lapsed automaat 1. koht",
  "2025 Eesti Noorte Karikasari – ATV Lapsed automaat 1. koht",
  "2025 EMV – ATV Lapsed automaat 2. koht",
];

const fallbackEvents = [
  { date: "18.04.2025", location: "Äksi", result: "" },
  { date: "25.05.2025", location: "Haanja", result: "" },
  { date: "13.07.2025", location: "Äksi", result: "" },
  { date: "26.07.2025", location: "Toila", result: "" },
  { date: "09.08.2025", location: "Räpina", result: "" },
  { date: "16.08.2025", location: "Tihemetsa", result: "" },
  { date: "30.08.2025", location: "Linnamäe", result: "" },
  { date: "20.09.2025", location: "Maardu", result: "" },
  { date: "02.05.2026", location: "Põlva", result: "" },
];

const quotes = [
  "Iga stardipuu on uus võimalus näidata, mida olen õppinud.",
  "Kiirus tuleb julgusest, aga võidud tulevad järjepidevusest.",
  "Parim ring algab usust, et suudan veel paremini.",
  "Rada ei anna midagi tasuta, kõik tuleb välja teenida.",
  "Kui pori lendab, peab pea jääma rahulikuks.",
  "Väike eelis tekib seal, kus teised katkestavad keskendumise.",
  "Iga finiš on algus järgmisele tugevamale stardile.",
  "Ma ei sõida ainult võidu nimel, vaid arengut jahtides.",
  "Julge sõit on tark sõit siis, kui kontroll tuleb kaasa.",
  "Treening paistab välja alles siis, kui stardilipud langevad.",
  "Mida raskem rada, seda rohkem loeb iseloom.",
  "Iga kurv õpetab midagi neile, kes tahavad kuulata.",
  "Tempot ei hoia ainult gaas, vaid otsused.",
  "Võitja ei otsi lihtsat rada, vaid puhast sõitu.",
  "57 ei ole ainult number, see on suhtumine rajal.",
];

const achievementsList = document.querySelector("#achievements-list");
const upcomingEvents = document.querySelector("#upcoming-events");
const pastEvents = document.querySelector("#past-events");
const dailyQuote = document.querySelector("#daily-quote");
const nextRace = document.querySelector("#next-race");
const winsCount = document.querySelector("#wins-count");
const podiumsCount = document.querySelector("#podiums-count");

function parseDate(dateString) {
  const [day, month, year] = dateString.split(".");
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
}

function formatDate(dateString) {
  return parseDate(dateString).toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDailyQuote() {
  const now = new Date();
  const dayIndex = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86400000
  );
  return quotes[dayIndex % quotes.length];
}

function getAchievementBadge(line) {
  if (line.includes("1. koht")) {
    return { text: "1. koht", className: "gold" };
  }

  if (line.includes("2. koht")) {
    return { text: "2. koht", className: "silver" };
  }

  return { text: "Tulemus", className: "silver" };
}

function parseAchievementLine(line) {
  const cleaned = line.replace(/^[-*]\s*/, "").replace(/^[^\w\d]+/u, "").trim();
  const badge = getAchievementBadge(cleaned);
  const parts = cleaned.split("–").map((part) => part.trim());
  const season = parts[0] || "Tulemus";
  const series = parts[1] || cleaned;
  return { cleaned, season, series, badge };
}

function renderAchievements(items) {
  const parsedItems = items.map(parseAchievementLine);
  achievementsList.innerHTML = parsedItems
    .map(
      ({ cleaned, season, series, badge }, index) => `
        <article class="achievement-item reveal" style="animation-delay: ${index * 90}ms">
          <div class="achievement-top">
            <div>
              <div class="achievement-title">${series}</div>
              <div class="achievement-meta">${season}</div>
            </div>
            <span class="achievement-badge ${badge.className}">${badge.text}</span>
          </div>
          <div class="achievement-meta">${cleaned}</div>
        </article>
      `
    )
    .join("");

  const wins = parsedItems.filter((item) => item.cleaned.includes("1. koht")).length;
  const podiums = parsedItems.filter((item) => /\b[123]\. koht\b/.test(item.cleaned)).length;

  winsCount.textContent = String(wins);
  podiumsCount.textContent = String(podiums);
}

function eventStatus(event) {
  const today = new Date();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  return parseDate(event.date) >= now ? "upcoming" : "past";
}

function renderEventGroup(container, items, kind) {
  if (!items.length) {
    container.innerHTML = `<p class="loading">${kind === "upcoming" ? "Uusi starte pole veel lisatud." : "Varasemaid starditulemusi pole veel lisatud."}</p>`;
    return;
  }

  container.innerHTML = items
    .map(
      (event, index) => `
        <article class="event-item ${kind} reveal" style="animation-delay: ${index * 90}ms">
          <div class="event-top">
            <div>
              <div class="event-title">${event.location}</div>
              <div class="event-meta">${formatDate(event.date)}</div>
            </div>
            <span class="event-tag">${kind === "upcoming" ? "Tulekul" : "Toimunud"}</span>
          </div>
          <div class="event-meta">${event.result || (kind === "upcoming" ? "Stardis peagi." : "Tulemus lisamisel.")}</div>
        </article>
      `
    )
    .join("");
}

function renderEvents(items) {
  const sorted = [...items].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const upcoming = sorted.filter((event) => eventStatus(event) === "upcoming");
  const past = sorted.filter((event) => eventStatus(event) === "past").reverse();

  renderEventGroup(upcomingEvents, upcoming, "upcoming");
  renderEventGroup(pastEvents, past, "past");

  const next = upcoming[0];
  if (!next) {
    nextRace.innerHTML = `
      <strong>Uus hooaeg on silmapiiril</strong>
      <span>Järgmine võistlus lisatakse siia niipea, kui kalender on kinnitatud.</span>
    `;
    return;
  }

  nextRace.innerHTML = `
    <strong>${next.location}</strong>
    <span>${formatDate(next.date)}</span>
  `;
}

function parseAchievementsMarkdown(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.endsWith(":"))
    .map((line) => line.replace(/^[^\d]+(?=\d)/u, "").trim())
    .filter(Boolean);
}

function parseCompetitionCsv(csv) {
  return csv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [date, location, result = ""] = line.split(",");
      return { date: date.trim(), location: location.trim(), result: result.trim() };
    })
    .filter((entry) => entry.date && entry.location);
}

async function loadTextFile(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return await response.text();
  } catch {
    return fallback;
  }
}

async function init() {
  dailyQuote.textContent = getDailyQuote();

  const [achievementSource, competitionSource] = await Promise.all([
    loadTextFile("saavutused.md", fallbackAchievements.join("\n")),
    loadTextFile(
      "competitions.csv",
      [
        "date,location,result",
        ...fallbackEvents.map((event) => `${event.date},${event.location},${event.result}`),
      ].join("\n")
    ),
  ]);

  renderAchievements(parseAchievementsMarkdown(achievementSource));
  renderEvents(parseCompetitionCsv(competitionSource));
}

init();
