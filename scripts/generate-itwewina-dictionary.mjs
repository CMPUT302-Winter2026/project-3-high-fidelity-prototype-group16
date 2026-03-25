/**
 * Builds CreeWord[] and EnglishWord[] from itwêwina:
 * - JSON: https://itwewina.altlab.app/api/search/?query=...
 * - Paradigm morphs: parsed from <table class="paradigm__table"> on /word/{slug}/
 *
 * Run: node scripts/generate-itwewina-dictionary.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const EXTRA_SEEDS = [
	"walk",
	"run",
	"see",
	"hear",
	"speak",
	"sing",
	"dance",
	"laugh",
	"cry",
	"love",
	"hate",
	"give",
	"take",
	"make",
	"break",
	"build",
	"cut",
	"fight",
	"hunt",
	"cook",
	"drink",
	"sleep",
	"wake",
	"sit",
	"stand",
	"fall",
	"fly",
	"swim",
	"count",
	"learn",
	"teach",
	"read",
	"write",
	"help",
	"kill",
	"born",
	"die",
	"head",
	"foot",
	"heart",
	"blood",
	"bone",
	"skin",
	"hair",
	"mouth",
	"tooth",
	"tongue",
	"ear",
	"nose",
	"neck",
	"arm",
	"leg",
	"knee",
	"bear",
	"wolf",
	"beaver",
	"moose",
	"buffalo",
	"eagle",
	"snake",
	"mouse",
	"egg",
	"meat",
	"bread",
	"corn",
	"berry",
	"sugar",
	"salt",
	"knife",
	"canoe",
	"arrow",
	"pipe",
	"drum",
	"song",
	"story",
	"name",
	"ghost",
	"sweetgrass",
	"cedar",
	"sage",
	"tobacco",
	"pipestone",
	"moccasin",
	"blanket",
	"car",
	"money",
	"book",
	"school",
	"friend",
	"enemy",
	"chief",
	"woman",
	"man",
	"girl",
	"boy",
	"baby",
	"eat",
	"hungry",
	"thirsty",
	"tired",
	"sick",
	"afraid",
	"angry",
	"red",
	"white",
	"black",
	"yellow",
	"green",
	"blue",
	"one",
	"two",
	"three",
	"many",
	"all",
	"none",
	"today",
	"tomorrow",
	"yesterday",
	"spring",
	"summer",
	"winter",
	"fall",
	"morning",
	"night",
	"wind",
	"thunder",
	"lightning",
	"earth",
	"stone",
	"sand",
	"ice",
	"mud",
	"path",
	"camp",
	"village",
	"language",
	"pray",
	"ceremony",
	"gift",
	"thanks",
	"yes",
	"no",
	"why",
	"how",
	"where",
	"who",
	"dog team",
	"red deer",
	"whitefish",
	"tipi",
	"powwow",
];

const ENGLISH_VERBS = new Set(
	[
		"walk",
		"run",
		"see",
		"hear",
		"speak",
		"sing",
		"dance",
		"laugh",
		"cry",
		"love",
		"hate",
		"give",
		"take",
		"make",
		"break",
		"build",
		"cut",
		"fight",
		"hunt",
		"cook",
		"drink",
		"sleep",
		"wake",
		"sit",
		"stand",
		"fall",
		"fly",
		"swim",
		"count",
		"learn",
		"teach",
		"read",
		"write",
		"help",
		"kill",
		"born",
		"die",
		"birth",
	],
);

const ENGLISH_ADJECTIVES = new Set([
	"hungry",
	"thirsty",
	"tired",
	"sick",
	"afraid",
	"angry",
	"red",
	"white",
	"black",
	"yellow",
	"green",
	"blue",
	"happy",
	"sad",
	"fast",
	"slow",
	"hot",
	"cold",
	"strong",
	"weak",
	"beautiful",
	"ugly",
	"clean",
	"dirty",
	"good",
	"new",
	"old",
	"long",
	"little",
	"big",
	"small",
	"large",
]);

function readEnglishSeedsFromProject() {
	const p = path.join(ROOT, "src/lib/assets/content/englishWords.ts");
	const text = fs.readFileSync(p, "utf8");
	const out = [];
	const re = /text:\s*"([^"]+)"/g;
	let m;
	while ((m = re.exec(text)) !== null) out.push(m[1]);
	return out;
}

function normalizeSro(s) {
	if (!s) return "";
	return s
		.replace(/\u00FD/g, "ê")
		.replace(/\u00DD/g, "Ê")
		.normalize("NFC");
}

function stripTags(s) {
	return s
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * @param {string} pageHtml
 * @returns {{ semantic: string; creeMorph: string }[]}
 */
function parseParadigmMorphs(pageHtml) {
	const m = pageHtml.match(/<table class="paradigm__table">([\s\S]*?)<\/table>/);
	if (!m) return [];
	const inner = m[1];
	const trs = [...inner.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((x) => x[1]);

	let section = "";
	let colHeader = "";
	let rowLabel = "";
	const out = [];

	for (const row of trs) {
		if (/<th[^>]*paradigm-header/.test(row)) {
			const t = row.match(/<th[^>]*paradigm-header[^>]*>([\s\S]*?)<\/th>/);
			if (t) {
				section = stripTags(t[1]);
				colHeader = "";
			}
			continue;
		}
		if (/<th[^>]*paradigm-label--col/.test(row)) {
			const t = row.match(/<th[^>]*paradigm-label--col[^>]*>([\s\S]*?)<\/th>/);
			if (t) colHeader = stripTags(t[1]);
			continue;
		}
		if (/<th[^>]*paradigm-label--row/.test(row)) {
			const t = row.match(/<th[^>]*paradigm-label--row[^>]*>([\s\S]*?)<\/th>/);
			if (t) rowLabel = stripTags(t[1]);
		}

		const creeMatches = [...row.matchAll(/data-orth-Latn="([^"]+)"/g)].map((x) => x[1]);
		if (!creeMatches.length) continue;
		for (const cree of creeMatches) {
			const semantic = [section, colHeader, rowLabel].filter(Boolean).join(" — ");
			const cm = normalizeSro(cree);
			if (semantic && cm) out.push({ semantic, creeMorph: cm });
		}
	}
	return out;
}

function wordTypeFromLemma(lw) {
	const p = lw?.paradigm;
	if (p) {
		if (p.startsWith("V")) return "Verb";
		if (
			p === "NA" ||
			p === "NI" ||
			p === "NDA" ||
			p === "NDI" ||
			p === "IPC" ||
			p === "PRON"
		) {
			return "Noun";
		}
	}

	const pos = lw?.linguist_info?.pos;
	const ic = lw?.linguist_info?.inflectional_category ?? "";

	if (pos === "V") return "Verb";
	// Ipc = particle, Pron = pronoun — CreeWord only has Noun | Verb
	if (pos === "N" || pos === "Ipc" || pos === "Pron") return "Noun";

	if (ic.startsWith("V")) return "Verb";
	if (ic.startsWith("N") || ic === "IPC" || ic.startsWith("ND")) return "Noun";

	return null;
}

function detailedWordType(lw) {
	return lw?.linguist_info?.inflectional_category ?? lw?.paradigm ?? "—";
}

function guessEnglishWordType(q) {
	const k = q.toLowerCase();
	if (ENGLISH_VERBS.has(k)) return "Verb";
	if (ENGLISH_ADJECTIVES.has(k)) return "Adjective";
	return "Noun";
}

function looksLikeLatinEnglishSeed(q) {
	return /^[a-zA-Z][a-zA-Z\s'-]*$/.test(q) && q.length < 48;
}

async function search(query) {
	const url = `https://itwewina.altlab.app/api/search/?query=${encodeURIComponent(query)}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${query}: ${res.status}`);
	return res.json();
}

async function fetchWordPageHtml(slug) {
	const url = `https://itwewina.altlab.app/word/${encodeURIComponent(slug)}/`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`word ${slug}: ${res.status}`);
	return res.text();
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function descriptionsFromApiResult(result) {
	return [
		...new Set((result.definitions ?? []).map((d) => d.text?.trim()).filter(Boolean)),
	];
}

function buildCreeWord(apiResult, morphs) {
	const lw = apiResult.lemma_wordform;
	const wt = wordTypeFromLemma(lw);
	if (!wt) return null;

	const descs = descriptionsFromApiResult(apiResult);
	if (!descs.length) return null;

	return {
		primaryText: normalizeSro(lw.text),
		wordType: wt,
		detailedWordType: detailedWordType(lw),
		descriptions: descs,
		morphs,
	};
}

function descriptionsForEnglishEntry(creePrimaryTexts, lemmaBySlug) {
	const glosses = new Set();
	for (const { result } of lemmaBySlug.values()) {
		const pt = normalizeSro(result.lemma_wordform.text);
		if (!creePrimaryTexts.includes(pt)) continue;
		for (const d of descriptionsFromApiResult(result)) glosses.add(d);
	}
	return [...glosses].slice(0, 24);
}

async function main() {
	const seeds = [...new Set([...readEnglishSeedsFromProject(), ...EXTRA_SEEDS])];
	const lemmaBySlug = new Map();
	/** @type {Map<string, string[]>} */
	const creeAddedByQuery = new Map();

	const perQuery = 4;
	const searchDelay = 280;
	const pageDelay = 220;
	const target = 380;

	for (const q of seeds) {
		if (lemmaBySlug.size >= target) break;
		let data;
		try {
			data = await search(q);
		} catch (e) {
			console.warn(String(e.message || e));
			await sleep(searchDelay);
			continue;
		}

		const addedTexts = [];
		for (const r of (data.search_results ?? []).slice(0, perQuery)) {
			if (lemmaBySlug.size >= target) break;
			const slug = r.lemma_wordform?.slug ?? r.lemma_wordform?.text;
			if (!slug || lemmaBySlug.has(slug)) continue;
			lemmaBySlug.set(slug, { result: r });
			addedTexts.push(normalizeSro(r.lemma_wordform.text));
		}
		if (looksLikeLatinEnglishSeed(q) && addedTexts.length) {
			creeAddedByQuery.set(q, addedTexts);
		}
		await sleep(searchDelay);
	}

	console.log(`Collected ${lemmaBySlug.size} lemmas, fetching paradigm tables…`);

	const creeWords = [];
	let i = 0;
	for (const [slug, { result }] of lemmaBySlug) {
		i += 1;
		let morphs = [];
		try {
			const html = await fetchWordPageHtml(slug);
			morphs = parseParadigmMorphs(html);
		} catch (e) {
			console.warn(`${slug}: ${e.message || e}`);
		}
		const cw = buildCreeWord(result, morphs);
		if (cw) creeWords.push(cw);
		if (i % 40 === 0) console.log(`  …${i}/${lemmaBySlug.size}`);
		await sleep(pageDelay);
	}

	const englishWords = [];
	for (const [q, creeList] of creeAddedByQuery) {
		const descriptions = descriptionsForEnglishEntry(creeList, lemmaBySlug);
		englishWords.push({
			primaryText: q,
			wordType: guessEnglishWordType(q),
			descriptions:
				descriptions.length > 0
					? descriptions
					: [`Cree lemma examples collected while searching “${q}” in itwêwina.`],
			creeWords: creeList,
		});
	}

	const outPath = path.join(ROOT, "src/lib/assets/content/itwewinaScrapedDictionary.ts");
	const file = `// Auto-generated by scripts/generate-itwewina-dictionary.mjs
// Source: https://itwêwina.altlab.app/ (API + paradigm__table HTML)
// Morphs come from on-site inflection tables, not API segment guesses.
// Prototype / offline demo only.

import type { CreeWord, EnglishWord } from "$lib/assets/content/dummy/types";

export const itwewinaCreeWords: CreeWord[] = ${JSON.stringify(creeWords, null, "\t")};

export const itwewinaEnglishWords: EnglishWord[] = ${JSON.stringify(englishWords, null, "\t")};
`;

	fs.writeFileSync(outPath, file, "utf8");
	console.log(
		`Wrote ${creeWords.length} CreeWord and ${englishWords.length} EnglishWord entries → ${path.relative(ROOT, outPath)}`,
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
