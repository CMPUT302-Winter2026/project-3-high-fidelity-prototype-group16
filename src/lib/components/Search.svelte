<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        text?: string;
        autoCompleteProvider: (key: string) => string[];
        style?: string;
        onsubmit?: () => void;
        autoSubmit?: boolean;
        noResTemplate?: Snippet;
        focused?: boolean;
    }

    let {
        text = $bindable(""),
        autoCompleteProvider,
        onsubmit = () => {},
        style,
        autoSubmit = true,
        noResTemplate,
        focused = $bindable(false),
    }: Props = $props();

    let completeOptions = $derived(autoCompleteProvider(text));

    let showingOptions = $derived(text.length > 0 && focused);
    let searchContent = $state<HTMLDivElement>();

    function ItemSelected(key: string) {
        text = key;
        focused = false;
        if (autoSubmit) {
            onsubmit();
        }
    }
</script>

<div class="wrapper" class:displayContent={showingOptions} {style}>
    <input
        placeholder="Search ..."
        type="search"
        bind:value={text}
        onkeypress={(e) => {
            if (e.key === "enter") onsubmit();
        }}
        
        onfocus={() => {
            focused = true;
        }}
        onfocusout={(e) => {
            if (searchContent && searchContent.contains(e.relatedTarget as Node)) {
                return;
            }
            focused = false;
        }}
    />

    {#if showingOptions}
        <div class="searchContent" bind:this={searchContent}>
            {#if completeOptions.length === 0}
                <span class="noRes">No results found.</span>
            {/if}

            {#each completeOptions as item (item)}
                <button
                    tabindex="0"
                    class="searchItem"
                    onclick={() => {
                        ItemSelected(item);
                    }}
                >
                    {item}
                </button>
            {/each}

            {#if noResTemplate}
                {@render noResTemplate()}
            {/if}
        </div>
    {/if}

    <img class="icon" src="/icons/search.svg" alt="" />
</div>

<style>
    .wrapper {
        width: auto;
        position: relative;

        background-color: var(--bg0);
        border: 2px solid var(--fg0);
        border-radius: 8px;
        color: var(--fg0);
        display: flex;
        flex-direction: row;

        transition:
            background-color 180ms ease-out,
            border-color 180ms ease-out,
            color 180ms ease-out;
    }

    .wrapper:focus-within {
        background-color: var(--bg1);
        border-color: var(--fg1);
        color: var(--fg1);
    }

    .wrapper.displayContent {
        border-radius: 8px 8px 0 0;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        outline: none;
        border: none;
        background-color: transparent;
        color: inherit;
        border-radius: 8px;
    }

    input::placeholder {
        color: var(--fg1);
    }

    .searchContent {
        background-color: var(--bg0);
        position: absolute;
        z-index: 1000;

        top: calc(100% + 2px);
        left: -2px;

        width: calc(100% + 4px);
        height: fit-content;

        display: flex;
        flex-direction: column;

        border: 2px solid var(--fg0);
        border-top: none;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
    }

    .searchItem {
        border: none;
        background-color: var(--bg0);
        border-bottom: 1px solid var(--fg0);
        color: var(--fg0);
        display: flex;
        justify-content: flex-start;
        padding: 0.5rem;

        transition:
            background-color 180ms ease-out,
            color 180ms ease-out;
    }

    .searchItem:hover {
        background-color: var(--bg1);
        color: var(--fg1);
    }

    .searchItem:active {
        background-color: var(--fg0);
        color: var(--bg0);
    }

    .searchItem:last-child {
        border: none;
    }

    .noRes {
        padding: 0.5rem;
        color: var(--fg1);
    }

    .icon {
        width: 1rem;
        height: auto;
        margin-right: 0.5rem;
        opacity: 0.75;
    }
</style>
