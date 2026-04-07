<script lang="ts">
	import { UiStates } from "$lib/assets/shared_states/ui.svelte";
	import { onMount } from "svelte";
	import CreeSearchComp from "./CreeSearchComp.svelte";
	import IconButton from "$lib/components/IconButton.svelte";
</script>

<div class="hor container" bind:clientHeight={UiStates.topbarHeight}>
	<IconButton
		onclick={() => {
			history.back();
		}}
	>
		<img src="/icons/back.svg" alt="" style="width: 1rem; height:auto;" />
	</IconButton>

	<CreeSearchComp></CreeSearchComp>

	<a href="/settings	">
		<IconButton>
			<img src="/icons/setting.svg" alt="settings button." />
		</IconButton>
	</a>

	<a href="/">
		<IconButton>
			<img src="/icons/home.svg" alt="Go home" />
		</IconButton>
	</a>
</div>

<style>
	.container {
		position: sticky;
		top: 0;

		width: 100%;
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;

		background-color: var(--bk);
		z-index: 1000;
	}
</style>
