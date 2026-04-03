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
	// Actions
	"walk", "run", "see", "hear", "speak", "sing", "dance", "laugh", "cry",
	"love", "hate", "give", "take", "make", "break", "build", "cut", "fight",
	"hunt", "cook", "drink", "sleep", "wake", "sit", "stand", "fall", "fly",
	"swim", "count", "learn", "teach", "read", "write", "help", "kill", "die",
	"eat", "pray", "play", "jump", "run away", "carry", "throw", "pull", "push",
	"open", "close", "arrive", "leave", "return", "follow", "call", "ask",
	"answer", "think", "know", "remember", "forget", "want", "need", "find",
	"lose", "choose", "start", "stop", "wait", "watch", "listen", "touch",
	"hold", "drop", "climb", "dig", "plant", "pick", "gather", "trap", "fish",
	"shoot", "hit", "bite", "burn", "wash", "clean", "feed", "grow", "share",
	"trade", "buy", "sell", "work", "rest", "dream", "wake up", "live", "stay",
	// Body
	"head", "foot", "heart", "blood", "bone", "skin", "hair", "mouth", "tooth",
	"tongue", "ear", "nose", "neck", "arm", "leg", "knee", "eye", "hand",
	"finger", "back", "shoulder", "chest", "stomach", "face", "lip", "throat",
	"brain", "lung", "liver", "kidney", "elbow", "wrist", "ankle", "heel",
	"thumb", "forehead", "cheek", "chin", "hip", "rib", "spine", "tail",
	// Animals
	"bear", "wolf", "beaver", "moose", "buffalo", "eagle", "snake", "mouse",
	"deer", "rabbit", "lynx", "fox", "otter", "muskrat", "goose", "duck",
	"owl", "crow", "hawk", "frog", "fish", "salmon", "pike", "sturgeon",
	"fly", "mosquito", "bee", "worm", "horse", "dog", "cat", "bird",
	"caribou", "elk", "mink", "weasel", "turtle", "loon", "raven", "sparrow",
	// Nature / land
	"earth", "stone", "sand", "ice", "mud", "path", "water", "fire", "tree",
	"grass", "flower", "root", "leaf", "branch", "forest", "river", "lake",
	"mountain", "hill", "valley", "sky", "sun", "moon", "star", "cloud",
	"rain", "snow", "wind", "thunder", "lightning", "fog", "spring", "summer",
	"winter", "fall", "morning", "night", "day", "land", "island", "shore",
	"swamp", "meadow", "creek", "spring water", "smoke", "ash", "mud flat",
	// Family / people
	"mother", "father", "sister", "brother", "grandmother", "grandfather",
	"child", "son", "daughter", "husband", "wife", "family", "elder",
	"woman", "man", "girl", "boy", "baby", "friend", "enemy", "chief",
	"hunter", "warrior", "healer", "teacher", "leader", "guest", "stranger",
	// Food / plants
	"egg", "meat", "bread", "corn", "berry", "sugar", "salt", "root",
	"mushroom", "wild rice", "blueberry", "strawberry", "chokecherry",
	"bannock", "pemmican", "broth", "fat", "marrow", "honey",
	// Objects / tools
	"knife", "canoe", "arrow", "pipe", "drum", "axe", "rope", "net",
	"bowl", "bag", "blanket", "moccasin", "tipi", "fire", "trap", "paddle",
	"bow", "spear", "needle", "thread", "hide", "pot", "basket",
	"car", "money", "book", "school", "house", "door", "window", "road",
	// States / qualities
	"hungry", "thirsty", "tired", "sick", "afraid", "angry", "happy", "sad",
	"strong", "weak", "fast", "slow", "big", "small", "old", "young",
	"hot", "cold", "wet", "dry", "loud", "quiet", "dark", "light",
	"alive", "dead", "free", "lost", "ready", "busy", "alone", "together",
	"good", "bad", "beautiful", "ugly", "clean", "dirty", "new", "broken",
	// Colours / numbers
	"red", "white", "black", "yellow", "green", "blue", "brown", "grey",
	"one", "two", "three", "four", "five", "many", "all", "none", "half",
	// Time / place
	"today", "tomorrow", "yesterday", "soon", "always", "never", "now",
	"here", "there", "far", "near", "inside", "outside", "above", "below",
	// Culture / ceremony
	"sweetgrass", "cedar", "sage", "tobacco", "pipestone", "drum", "song",
	"story", "name", "ghost", "spirit", "medicine", "ceremony", "prayer",
	"gift", "thanks", "feast", "dance", "vision", "dream", "sacred",
	"sweat lodge", "powwow", "treaty", "language", "teaching",
	// Common words
	"yes", "no", "why", "how", "where", "who", "what", "when",
	"dog team", "red deer", "whitefish", "tipi", "born",
	"body", "table", "camp", "village",
];

const ENGLISH_VERBS = new Set([
	"walk", "run", "see", "hear", "speak", "sing", "dance", "laugh", "cry",
	"love", "hate", "give", "take", "make", "break", "build", "cut", "fight",
	"hunt", "cook", "drink", "sleep", "wake", "sit", "stand", "fall", "fly",
	"swim", "count", "learn", "teach", "read", "write", "help", "kill", "die",
	"eat", "pray", "play", "jump", "carry", "throw", "pull", "push", "open",
	"close", "arrive", "leave", "return", "follow", "call", "ask", "answer",
	"think", "know", "remember", "forget", "want", "need", "find", "lose",
	"choose", "start", "stop", "wait", "watch", "listen", "touch", "hold",
	"drop", "climb", "dig", "plant", "pick", "gather", "trap", "fish",
	"shoot", "hit", "bite", "burn", "wash", "clean", "feed", "grow", "share",
	"trade", "buy", "sell", "work", "rest", "dream", "live", "stay",
	"run away", "wake up", "born", "birth",
]);

const ENGLISH_ADJECTIVES = new Set([
	"hungry", "thirsty", "tired", "sick", "afraid", "angry", "happy", "sad",
	"strong", "weak", "fast", "slow", "hot", "cold", "wet", "dry", "loud",
	"quiet", "dark", "light", "alive", "dead", "free", "lost", "ready",
	"busy", "alone", "together", "good", "bad", "beautiful", "ugly", "clean",
	"dirty", "new", "old", "broken", "long", "little", "big", "small", "large",
	"red", "white", "black", "yellow", "green", "blue", "brown", "grey",
	"sacred", "young", "far", "near",
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

	const perQuery = 6;
	const searchDelay = 280;
	const pageDelay = 220;
	const target = 1000;

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
	const creeWordsRecord = Object.fromEntries(creeWords.map((w) => [w.primaryText, w]));
	const englishWordsRecord = Object.fromEntries(englishWords.map((w) => [w.primaryText, w]));

	const file = `// Auto-generated by scripts/generate-itwewina-dictionary.mjs
// Source: https://itwêwina.altlab.app/ (API + paradigm__table HTML)
// Morphs come from on-site inflection tables, not API segment guesses.
// Prototype / offline demo only.

import type { CreeWord, EnglishWord } from "$lib/assets/content/dummy/types";

export const itwewinaCreeWords: CreeWord[] = ${JSON.stringify(creeWords, null, "\t")};

export const itwewinaEnglishWords: EnglishWord[] = ${JSON.stringify(englishWords, null, "\t")};

export const creeWords: Record<string, CreeWord> = ${JSON.stringify(creeWordsRecord, null, "\t")};

export const englishWords: Record<string, EnglishWord> = ${JSON.stringify(englishWordsRecord, null, "\t")};
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
