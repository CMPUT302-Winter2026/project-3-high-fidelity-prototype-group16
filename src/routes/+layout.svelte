<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { UiStates } from "$lib/assets/shared_states/ui.svelte";
	import "../global.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="wrapper">
	<div
		class="content thinScroll"
		onscroll={(e) => {
			UiStates.scrollY = (e.target as HTMLElement).scrollTop;
		}}
		id="main-layout"
	>
		{@render children()}
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100dvw;
	}

	.content {
		position: relative;
		height: 100dvh;
		width: 100dvw;
		max-height: 800px;
		max-width: 400px;

		overflow-y: auto;

		background-color: var(--bk);

		display: flex;
		flex-direction: column;

		/*padding: 2rem;*/
	}
</style>
