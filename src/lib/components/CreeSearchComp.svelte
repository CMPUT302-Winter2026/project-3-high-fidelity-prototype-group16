<script lang="ts">
	import { goto } from "$app/navigation";
	import { creeWords, englishWords } from "$lib/assets/content/itwewinaScrapedDictionary";
	import PushButton from "$lib/components/PushButton.svelte";
	import Search from "$lib/components/Search.svelte";
	import Fuse from "fuse.js";

	const fuse = new Fuse([...Object.values(creeWords), ...Object.values(englishWords)], {
		keys: ["primaryText", "descriptions"],
		isCaseSensitive: true,
		ignoreDiacritics: true,
		threshold: 0.45,
	});

	let text = $state("");
	let focused = $state(false);
</script>

{#snippet Missing()}
	<span style="padding: 0.5rem; font-size: smaller;"
		>Report a missing word?
		<a href="/missing/report#{text}">
			<PushButton
				onclick={() => {
					focused = false;
				}}
				>Report
			</PushButton>
		</a>
	</span>
{/snippet}

<Search
	bind:focused
	bind:text
	style="width:100%;
	max-width: 300px;"
	autoCompleteProvider={(key) => {
		const searchRes = fuse.search(key, {
			limit: 10,
		});

		return searchRes.map((item) => item.item.primaryText);
	}}
	onsubmit={() => {
		if (!(text in creeWords) && !(text in englishWords)) {
			alert("Word not found!");
		} else {
			goto(`/def/${text}`);
		}
	}}
	noResTemplate={Missing}
/>

<style>
	/* CSS */
</style>
