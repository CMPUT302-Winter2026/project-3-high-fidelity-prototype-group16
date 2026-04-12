<script lang="ts">
    import type { CreeWord } from "$lib/assets/content/dummy/types";
    import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
    import { UserPref } from "$lib/assets/shared_states/userPref.svelte";

    interface Props {
        word: CreeWord;
        expanded?: boolean;
    }

    let { word, expanded = true }: Props = $props();
    let contentHeight = $state(0);
</script>

<div class="detailContainer" style:--contentHeight={contentHeight} class:showDetail={expanded}>
    <div class="detailContent" bind:clientHeight={contentHeight}>
        <div class="divider"></div>
        <span>{word.detailedWordType}</span>

        <div class="morphsContainer">
            {#each word.morphs as morph (`${morph.semantic}-${morph.creeMorph}`)}
                <span style="grid-column: 1; text-align: right;">{morph.semantic}</span>

                <span style="grid-column: 2; text-align: left;"
                    >{CreeFormatTranslate(morph.creeMorph, { ...UserPref })}</span
                >
            {/each}
        </div>
    </div>
</div>

<style>
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
</style>
