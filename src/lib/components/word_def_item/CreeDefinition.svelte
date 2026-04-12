<script lang="ts">
	import type { CreeWord } from "$lib/assets/content/dummy/types";
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
	import { UserPref } from "$lib/assets/shared_states/userPref.svelte";
	import ImageModal from "$lib/components/ImageModal.svelte";
	import IconButton from "$lib/components/IconButton.svelte";
	import PushButton from "$lib/components/PushButton.svelte";

	interface Props {
		index: number;
		creeWord: CreeWord;
	}

	let { creeWord, index }: Props = $props();

	let showDetail = $state(false);
	let contentHeight = $state(0);
	let dialect = $state(UserPref.dialect);
	const dummyImages = ["/icons/photo.svg", "/icons/photo.svg", "/icons/photo.svg"];
	type ModalPageState = App.PageState & { imageModalWord?: string };
	let modalState = $derived(page.state as ModalPageState);
	let showImageModal = $derived(modalState.imageModalWord === creeWord.primaryText);

	function openImageModal() {
		if (showImageModal) {
			return;
		}

		pushState("", {
			...modalState,
			imageModalWord: creeWord.primaryText,
		});
	}

	function closeImageModal() {
		if (!showImageModal) {
			return;
		}

		history.back();
	}
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
			<IconButton
				onclick={() =>
					alert(
						`Mock audio playback, Chosen dialect: ${dialect}, chosen word ${creeWord.primaryText}`,
					)}
			>
				<img src="/icons/speaker.svg" alt="speaker" />
			</IconButton>
			<IconButton onclick={openImageModal}>
				<img src="/icons/photo.svg" alt="" />
			</IconButton>
		</div>
	</div>

	<ul>
		{#each creeWord.descriptions as desc, descIdx (`${desc}-${descIdx}`)}
			<li>{desc}</li>
		{/each}
	</ul>

	<!-- actions row: both buttons sit together, wrap if needed -->
	<div class="actions">
		<a href="/map/{creeWord.primaryText}">
			<PushButton>
				{#snippet prefix()}
					<img src="/icons/map.svg" alt="" style="width: 1.5rem;" />
				{/snippet}
				Related Words
			</PushButton>
		</a>
		<PushButton
			onclick={() => {
				showDetail = !showDetail;
			}}
		>
			Word Details
			{#snippet postfix()}
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
			{/snippet}
		</PushButton>
	</div>

	<div class="detailContainer" style:--contentHeight={contentHeight} class:showDetail>
		<div class="detailContent" bind:clientHeight={contentHeight}>
			<div class="divider"></div>
			<span>{creeWord.detailedWordType}</span>

			<div class="morphsContainer">
				{#each creeWord.morphs as morph (`${morph.semantic}-${morph.creeMorph}`)}
					<span style="grid-column: 1; text-align: right;">{morph.semantic}</span>

					<span style="grid-column: 2; text-align: left;"
						>{CreeFormatTranslate(morph.creeMorph, { ...UserPref })}</span
					>
				{/each}
			</div>
		</div>
	</div>

	<ImageModal
		open={showImageModal}
		onclose={closeImageModal}
		subjectLabel={CreeFormatTranslate(creeWord.primaryText, { ...UserPref })}
		images={dummyImages}
	/>
</div>

<style>
	.cree {
		font-family: CanadianSyllabic;
	}

	.container {
		padding: 0.75rem;
		border: 2px solid var(--fg1);
		background-color: var(--bg0);
		border-radius: 6px;

		width: 100%;
		max-width: 350px;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.title {
		font-size: larger;
		display: block;
		line-height: 1.25rem;
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

		justify-content: space-between;
	}

	.divider {
		width: auto;
		height: 2px;
		background-color: var(--fg0);
		margin: 0.5rem 0;
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

		transform: rotate(90deg);
	}

	.chevron.open {
		transform: rotate(0deg);
	}

	ul {
		margin: 0.5rem;
		padding-left: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
