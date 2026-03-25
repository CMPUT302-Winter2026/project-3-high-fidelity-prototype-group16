/**
 * Rebuilds wordConnections.ts from thematic clusters (all strings must exist as
 * CreeWord.primaryText in itwewinaScrapedDictionary.ts).
 *
 * Run: node scripts/build-word-connections.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DICT = fs.readFileSync(
	path.join(ROOT, "src/lib/assets/content/itwewinaScrapedDictionary.ts"),
	"utf8",
);
const creeOnly = DICT.split("export const itwewinaEnglishWords")[0];
const valid = new Set([...creeOnly.matchAll(/"primaryText":\s*"([^"]+)"/g)].map((m) => m[1]));

/** @type {string[][]} Thematic groups for dummy semantic map edges */
const CLUSTERS = [
	["pitamâ", "nistam", "mwêstas", "pêyakwâw", "kîhtwâm", "kapê-kîsik", "anohc kâ-kîsikâk", "pêyak-pipon"],
	["askiy", "pêyak-askiy", "pêci-askiy", "tânima êwako askiy", "misiwêskamik", "kihcikamîhk"],
	["pimâcihow", "pimâtisiw", "pimohtêhow", "pimâcihowin"],
	["kîkway", "anima", "ôhi", "ôma", "anihi", "aniki", "êwako", "kotak", "kotaka", "kotakak"],
	[
		"nicawâsimis",
		"nitawâsimis",
		"otawâsimisiw",
		"nimosôm",
		"nitôtêm",
		"nôhtâwiy",
		"kikâwiy",
		"ohtâwiya",
	],
	["iskwêw", "maskihkîwiskwêw", "oskinîkiw", "oskinîkiskwêw", "aya", "oski-aya"],
	[
		"kîsikâw",
		"kihci-kîsikâw",
		"pîsim",
		"tipiskohk",
		"tipiskâw",
		"ohpahowi-pîsim",
		"kisê-pîsim",
		"takwâki-pîsim",
		"miskîsikohkâna",
		"oskîsik",
		"cîkiskîsik",
		"cihcîpâpiw",
	],
	["nîpiy", "onipîm", "kimiwasin", "kimiwan", "sisonêkamîhk", "akâmi-sîpîhk"],
	["mîciwin", "mîcisowikamik", "mîcisowinâhtik", "omîcisowinâhtikow", "asâm"],
	[
		"masinahikan",
		"masinahikanâpisk",
		"masinahikanâhtik",
		"âcimow",
		"natomiwêwin",
		"nîkânitwêwin",
		"itwêstamâkêwasinahikan",
	],
	["mâka", "mâka mîna", "âta", "êkosi", "êkwa", "êkota", "êkotê", "kîspin", "piko", "mâni piko", "mâniko"],
	["apisis", "mistahi", "mihcêt", "misâw", "mihcêtiw", "capasis"],
	["nânitaw", "nitaw", "ohci", "itê", "kayâs", "kîkisêp", "wîpac"],
	["wâsênamawin", "wâsênamawinis", "wâsênamân", "wâsêskwan", "wâpikwaniy", "wâpakwanîwin"],
	["pahki", "pahkisimon", "pahkisimow", "pahkân"],
	["wîkiw", "wâskahikan", "atâwêwikamik", "kihci-atâwêwikamik", "pêhowikamik"],
	["ispayin", "ispayiw", "miyopayiw", "paspâpiw", "cîstahâsêpon"],
	["waniskâw", "awasi-wâpahki", "awasi-tipiskâki", "kisîkotêw"],
	["ati-", "maci-", "pê-", "apihci-", "nah", "ohci"],
	["pîhtaw", "pîhtokamik", "itâpiw", "itâpatisiw", "nîkân"],
];

/** Target neighbours ≈ existing clusters (~5–12); fully connect inside each batch */
const ORPHAN_BATCH_SIZE = 10;

function vet(w) {
	if (!valid.has(w)) console.warn(`Missing from dictionary: ${w}`);
	return valid.has(w);
}

/** @type {Record<string, string[]>} */
const conn = {};
for (const cluster of CLUSTERS) {
	const words = [...new Set(cluster)].filter(vet);
	if (words.length < 2) continue;
	for (const w of words) {
		for (const o of words) {
			if (o === w) continue;
			if (!conn[w]) conn[w] = [];
			if (!conn[w].includes(o)) conn[w].push(o);
		}
	}
}

const orphans = [...valid]
	.filter((w) => conn[w] === undefined)
	.sort((a, b) => a.localeCompare(b, "cr"));
/** @type {string[][]} */
const batches = [];
for (let i = 0; i < orphans.length; i += ORPHAN_BATCH_SIZE) {
	batches.push(orphans.slice(i, i + ORPHAN_BATCH_SIZE));
}
if (batches.length && batches[batches.length - 1].length === 1) {
	const lone = batches.pop()[0];
	if (batches.length) batches[batches.length - 1].push(lone);
	else batches.push([lone]);
}
for (const batch of batches) {
	if (batch.length < 2) continue;
	for (const w of batch) {
		for (const o of batch) {
			if (o === w) continue;
			if (!conn[w]) conn[w] = [];
			if (!conn[w].includes(o)) conn[w].push(o);
		}
	}
}

const sortedKeys = Object.keys(conn).sort((a, b) => a.localeCompare(b, "cr"));
const body = sortedKeys
	.map((k) => {
		const vals = conn[k].sort((a, b) => a.localeCompare(b, "cr"));
		const inner = vals.map((v) => `\t\t"${escapeStr(v)}"`).join(",\n");
		return `\t"${escapeStr(k)}": [\n${inner},\n\t]`;
	})
	.join(",\n\n");

function escapeStr(s) {
	return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const out = `// Dummy semantic links between Cree lemmas. Keys and values match CreeWord.primaryText in itwewinaScrapedDictionary.ts.
// Regenerate: node scripts/build-word-connections.mjs

export const CreeWordConnections: Record<string, string[]> = {
${body},
};
`;

fs.writeFileSync(path.join(ROOT, "src/lib/assets/content/wordConnections.ts"), out, "utf8");
console.log(`Wrote ${sortedKeys.length} keys → wordConnections.ts`);
