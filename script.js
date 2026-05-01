const fallbackAchievements = [
  {
    season: "2023",
    series: "Eesti Noorte Karikasari",
    category: "Motohobi ATV Hiinakas",
    result: "1. koht",
  },
  {
    season: "2023",
    series: "Äksi Motocross Cup",
    category: "Motohobi ATV Hiinakas",
    result: "1. koht",
  },
  {
    season: "2024",
    series: "Eesti Noorte Karikasari",
    category: "ATV Lapsed Junior",
    result: "1. koht",
  },
  {
    season: "2024",
    series: "Äksi Motocross Cup",
    category: "ATV Lapsed Junior",
    result: "1. koht",
  },
  {
    season: "2025",
    series: "Äksi Motocross Cup",
    category: "ATV Lapsed automaat",
    result: "1. koht",
  },
  {
    season: "2025",
    series: "Eesti Noorte Karikasari",
    category: "ATV Lapsed automaat",
    result: "1. koht",
  },
  {
    season: "2025",
    series: "EMV",
    category: "ATV Lapsed automaat",
    result: "2. koht",
  },
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

const driveGalleryImages = [
  {
    id: "1Ps6yc-co9CYHFYMUj76o0Z97Xnk3GK0G",
    name: "682052538_122235000050269913_2020579149367573356_n.jpg",
    alt: "Rocco Kubarsepp Google Drive galeriipilt",
    className: "wide",
  },
  {
    id: "1oDZEuwrwaOuR-Dj-xuAvbYYCw2KCJdIT",
    name: "682571011_122235000068269913_530570146186727876_n.jpg",
    alt: "Rocco Kubarsepp Google Drive galeriipilt",
    className: "tall",
  },
];

const competitionSheetUrl =
  "https://docs.google.com/spreadsheets/d/1nmnAj8D_vhykjlBHXUFyO_xIr3MjZB6xTQ3YndTFD6I/edit?usp=sharing";
const achievementsSheetUrl =
  "https://docs.google.com/spreadsheets/d/1hm8hq5-nRxcRfXC62z9driXru1cAWz6Ic0DVHdjxz-Y/edit?usp=sharing";

const achievementsList = document.querySelector("#achievements-list");
const todayCard = document.querySelector("#today-card");
const todayEvents = document.querySelector("#today-events");
const upcomingEvents = document.querySelector("#upcoming-events");
const pastEvents = document.querySelector("#past-events");
const galleryStrip = document.querySelector("#gallery-strip");
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

function buildAchievementLine(item) {
  return [item.season, item.series, item.category, item.result].filter(Boolean).join(" – ");
}

function getDriveImageUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
}

function getDriveFileUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;
}

function renderDriveGalleryImages() {
  if (!galleryStrip || !driveGalleryImages.length) {
    return;
  }

  const galleryMarkup = driveGalleryImages
    .map(
      (image, index) => `
        <figure class="gallery-card ${image.className || ""} reveal" style="animation-delay: ${index * 90}ms">
          <a href="${getDriveFileUrl(image.id)}" target="_blank" rel="noreferrer">
            <img src="${getDriveImageUrl(image.id)}" alt="${image.alt}" loading="lazy" />
          </a>
        </figure>
      `
    )
    .join("");

  galleryStrip.insertAdjacentHTML("beforeend", galleryMarkup);
}

function renderAchievements(items) {
  const parsedItems = items.map((item) => {
    const cleaned = buildAchievementLine(item);
    const badge = getAchievementBadge(cleaned);
    return {
      cleaned,
      season: item.season || "Tulemus",
      series: [item.series, item.category].filter(Boolean).join(" – ") || cleaned,
      badge,
    };
  });
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
  const parsedEventDate = parseDate(event.date);
  const eventDate = new Date(
    parsedEventDate.getFullYear(),
    parsedEventDate.getMonth(),
    parsedEventDate.getDate(),
    0,
    0,
    0
  );

  if (eventDate.getTime() === now.getTime()) {
    return "today";
  }

  return eventDate > now ? "upcoming" : "past";
}

function renderEventGroup(container, items, kind) {
  if (!items.length) {
    if (kind === "today") {
      container.innerHTML = `<p class="loading">Täna võistlust kalendris ei ole.</p>`;
      return;
    }

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
            <span class="event-tag">${kind === "today" ? "Täna" : kind === "upcoming" ? "Tulekul" : "Toimunud"}</span>
          </div>
          <div class="event-meta">${event.result ? `Koht: ${event.result}` : kind === "today" ? "Stardis täna." : kind === "upcoming" ? "Stardis peagi." : "Tulemus lisamisel."}</div>
        </article>
      `
    )
    .join("");
}

function renderEvents(items) {
  const sorted = [...items].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const today = sorted.filter((event) => eventStatus(event) === "today");
  const upcoming = sorted.filter((event) => eventStatus(event) === "upcoming");
  const past = sorted.filter((event) => eventStatus(event) === "past").reverse();

  todayCard.hidden = !today.length;
  renderEventGroup(todayEvents, today, "today");
  renderEventGroup(upcomingEvents, upcoming, "upcoming");
  renderEventGroup(pastEvents, past, "past");

  const next = today[0] || upcoming[0];
  if (!next) {
    nextRace.innerHTML = `
      <strong>Uus hooaeg on silmapiiril</strong>
      <span>Järgmine võistlus lisatakse siia niipea, kui kalender on kinnitatud.</span>
    `;
    return;
  }

  nextRace.innerHTML = `
    <strong>${next.location}</strong>
    <span>${today.length ? `Täna, ${formatDate(next.date)}` : formatDate(next.date)}</span>
  `;
}

function createGoogleSheetCsvUrl(sheetUrl) {
  try {
    const url = new URL(sheetUrl);
    const match = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);

    if (!match) {
      return null;
    }

    const gid = url.searchParams.get("gid") || "0";
    return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
  } catch {
    return null;
  }
}

function parseCsvRows(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        cell += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(cell.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }

      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(header) {
  return header.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "");
}

function getHeaderIndex(headers, aliases) {
  return headers.findIndex((header) => aliases.includes(header));
}

function isValidDateString(dateString) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
    return false;
  }

  const [day, month, year] = dateString.split(".").map(Number);
  const parsed = new Date(year, month - 1, day, 12, 0, 0);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

function parseCompetitionRow(row, dateIndex, locationIndex, resultIndex) {
  const date = row[dateIndex]?.trim() || "";
  const location = row[locationIndex]?.trim() || "";
  const result = resultIndex === -1 ? "" : row[resultIndex]?.trim() || "";

  if (!isValidDateString(date) || !location) {
    return null;
  }

  return { date, location, result };
}

function parseBundledCompetitionRow(row) {
  const dateCell = row[0]?.trim() || "";
  const locationCell = row[1]?.trim() || "";
  const resultCell = row[2]?.trim() || "";

  if (!/^date\b/i.test(dateCell) || !/^location\b/i.test(locationCell)) {
    return [];
  }

  const dates = dateCell.replace(/^date\b\s*/i, "").trim().split(/\s+/).filter(Boolean);
  const locations = locationCell
    .replace(/^location\b\s*/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const results = resultCell.replace(/^result\b\s*/i, "").trim();
  const count = Math.min(dates.length, locations.length);

  return Array.from({ length: count }, (_, index) => ({
    date: dates[index],
    location: locations[index],
    result: results ? results : "",
  })).filter((entry) => isValidDateString(entry.date) && entry.location);
}

function parseAchievementsCsv(csv) {
  const rows = parseCsvRows(csv);
  if (!rows.length) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map(normalizeHeader);
  const seasonIndex = getHeaderIndex(headers, ["season", "year", "hooaeg"]);
  const seriesIndex = getHeaderIndex(headers, ["series", "karikasari", "sarja", "voistlus"]);
  const categoryIndex = getHeaderIndex(headers, ["category", "class", "klass", "kategooria"]);
  const resultIndex = getHeaderIndex(headers, ["result", "tulemus", "koht"]);

  if (seasonIndex === -1 || seriesIndex === -1 || resultIndex === -1) {
    return [];
  }

  return dataRows
    .map((row) => ({
      season: row[seasonIndex]?.trim() || "",
      series: row[seriesIndex]?.trim() || "",
      category: categoryIndex === -1 ? "" : row[categoryIndex]?.trim() || "",
      result: row[resultIndex]?.trim() || "",
    }))
    .filter((entry) => entry.season && entry.series && entry.result);
}

function parseCompetitionCsv(csv) {
  const rows = parseCsvRows(csv);
  if (!rows.length) {
    return [];
  }

  const bundledEntries = parseBundledCompetitionRow(rows[0]);
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map(normalizeHeader);
  const dateIndex = getHeaderIndex(headers, ["date", "kuupaev"]);
  const locationIndex = getHeaderIndex(headers, [
    "location",
    "koht",
    "rada",
    "track",
    "venue",
    "competition",
    "event",
    "voistlus",
  ]);
  const resultIndex = getHeaderIndex(headers, ["result", "tulemus"]);

  if (dateIndex !== -1 && locationIndex !== -1) {
    return dataRows
      .map((row) => parseCompetitionRow(row, dateIndex, locationIndex, resultIndex))
      .filter(Boolean);
  }

  const positionalEntries = rows
    .map((row) => parseCompetitionRow(row, 0, 1, 2))
    .filter(Boolean);

  return [...bundledEntries, ...positionalEntries];
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

async function loadSheetBackedCsvSource(sheetUrl, localPath, fallback, parser) {
  const sheetCsvUrl = createGoogleSheetCsvUrl(sheetUrl);

  if (sheetCsvUrl) {
    try {
      const response = await fetch(sheetCsvUrl);
      if (!response.ok) {
        throw new Error("Failed to load Google Sheet");
      }
      const source = await response.text();
      if (parser(source).length) {
        return source;
      }
    } catch {
      // Fall back to the local CSV when the shared sheet is unavailable.
    }
  }

  return loadTextFile(localPath, fallback);
}

async function init() {
  dailyQuote.textContent = getDailyQuote();
  renderDriveGalleryImages();

  const achievementsFallback = [
    "season,series,category,result",
    ...fallbackAchievements.map(
      (item) => `${item.season},${item.series},${item.category},${item.result}`
    ),
  ].join("\n");

  const competitionFallback = [
    "date,location,result",
    ...fallbackEvents.map((event) => `${event.date},${event.location},${event.result}`),
  ].join("\n");

  const [achievementSource, competitionSource] = await Promise.all([
    loadSheetBackedCsvSource(
      achievementsSheetUrl,
      "saavutused.csv",
      achievementsFallback,
      parseAchievementsCsv
    ),
    loadSheetBackedCsvSource(
      competitionSheetUrl,
      "competitions.csv",
      competitionFallback,
      parseCompetitionCsv
    ),
  ]);

  renderAchievements(parseAchievementsCsv(achievementSource));
  renderEvents(parseCompetitionCsv(competitionSource));
}

init();
