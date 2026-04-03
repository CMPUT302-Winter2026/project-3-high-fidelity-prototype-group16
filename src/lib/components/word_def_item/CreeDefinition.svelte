<script lang="ts">
	import type { CreeWord } from "$lib/assets/content/dummy/types";
	import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
	import { UserPref } from "$lib/assets/shared_states/userPref.svelte";

	interface Props {
		index: number;
		creeWord: CreeWord;
	}

	let { creeWord, index }: Props = $props();

	let showDetail = $state(false);
	let contentHeight = $state(0);
	let dialect = $state(UserPref.dialect);
</script>

<div class="container" class:cree={UserPref.format === "Syllabics"}>
	<!-- title: full width so long words never compete with icons -->
	<span class="title">
		{index}. {CreeFormatTranslate(creeWord.primaryText, { ...UserPref })}
	</span>

	<!-- meta row: word type left, icons right -->
	<div class="metaRow">
		<span class="wordType">[{creeWord.wordType}]</span>
		<div class="iconRow">
			<button
				class="iconBtn"
				onclick={() => alert(`Mock audio playback, Chosen dialect: ${dialect}, chosen word ${creeWord.primaryText}`)}
			>
				<img src="/icons/speaker.svg" alt="speaker" />
			</button>
			<button class="iconBtn">
				<img src="/icons/photo.svg" alt="" />
			</button>
		</div>
	</div>

	<ul>
		{#each creeWord.descriptions as desc}
			<li>{desc}</li>
		{/each}
	</ul>

	<!-- actions row: both buttons sit together, wrap if needed -->
	<div class="actions">
		<a href="/map/{creeWord.primaryText}">
			<button class="semantic">
				<img src="/icons/map.svg" alt="" /> View related words map
			</button>
		</a>
		<button
			class="detailToggleBtn"
			onclick={() => { showDetail = !showDetail; }}
			aria-expanded={showDetail}
		>
			{showDetail ? "Hide word details" : "See word details"}
			<svg
				class="chevron"
				class:open={showDetail}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</button>
	</div>

	<!-- <h2 bind:clientHeight={contentHeight}>Tester</h2> -->

	<div class="detailContainer" style:--contentHeight={contentHeight} class:showDetail>
		<div class="detailContent" bind:clientHeight={contentHeight}>
			<div class="divider"></div>
			<span>{creeWord.detailedWordType}</span>

			<div class="morphsContainer">
				{#each creeWord.morphs as morph}
					<span style="grid-column: 1; text-align: right;">{morph.semantic}</span>

					<span style="grid-column: 2; text-align: left;"
						>{CreeFormatTranslate(morph.creeMorph, { ...UserPref })}</span
					>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.cree {
		font-family: CanadianSyllabic;
	}

	.container {
		padding: 0.75rem;
		border: 2px solid var(--black);
		border-radius: 6px;

		width: 100%;
		max-width: 350px;
	}

	.title {
		font-size: larger;
		display: block;
	}

	.metaRow {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.25rem;
	}

	.wordType {
		font-size: smaller;
		color: var(--grey);
	}

	.iconRow {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
	}

	.actions {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.divider {
		width: auto;
		height: 2px;
		background-color: var(--black);
		margin: 0.25rem 0;
	}

	.detailContent {
		display: flex;
		flex-direction: column;
		position: relative;
		padding-top: 0.5rem;
	}

	.detailContainer {
		height: fit-content;
		max-height: 0;

		transition: max-height 200ms ease-out;
		overflow: hidden;
	}

	.detailContainer.showDetail {
		max-height: calc(var(--contentHeight) * 1px);
	}

	.morphsContainer {
		font-size: smaller;
		margin-top: 0.5rem;

		max-width: 100%;
		display: grid;
		grid-template-columns: auto-fill auto-fill;
		gap: 1rem;
	}

	button {
		display: flex;
		align-items: center;
		flex-direction: row;
		width: fit-content;

		border: 1px solid var(--lightGrey);
		transition: border-color 200ms ease-out;
		background-color: transparent;

		padding: 0.25rem;
	}

	button:hover {
		border-color: var(--black);
	}

	button > img {
		height: auto;
		width: 1.25rem;
	}

	button.iconBtn {
		width: 1.75rem;
		height: 1.75rem;
	}

	.detailToggleBtn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: small;
		width: fit-content;
		height: fit-content;
		padding: 0.2rem 0.4rem;
		white-space: nowrap;
	}

	.chevron {
		width: 1rem;
		height: 1rem;
		transition: transform 200ms ease-out;
		flex-shrink: 0;
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	ul {
		margin: 0.5rem;
		padding-left: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
