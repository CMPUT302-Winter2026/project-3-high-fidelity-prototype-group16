<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        A: string;
        B: string;
        value: string;
        labelA?: string | Snippet;
        labelB?: string | Snippet;
        minWidth?: string;
    }

    let { A, B, value = $bindable(), labelA, labelB, minWidth = "150px" }: Props = $props();
</script>

<div class="container" style="min-width: {minWidth}">
    <button
        type="button"
        class:selected={value === A}
        class="btn A"
        onclick={() => { value = A; }}
    >
        {#if typeof labelA === "function"}{@render labelA()}{:else}{labelA ?? A}{/if}
    </button>
    <button
        type="button"
        class:selected={value === B}
        class="btn B"
        onclick={() => { value = B; }}
    >
        {#if typeof labelB === "function"}{@render labelB()}{:else}{labelB ?? B}{/if}
    </button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        width: fit-content;
        min-width: 150px;

        border-radius: 8px;
        border: 2px solid var(--fg0);

        overflow: hidden;
    }

    .btn {
        flex: 1;
        padding: 0.5rem 0.75rem;

        color: var(--fg0);
        background-color: var(--bg0);

        border: none;

        transition:
            background-color 180ms ease-out,
            color 180ms ease-out,
            transform 120ms ease-out;
    }

    .btn:hover {
        background-color: var(--bg1);
        color: var(--fg1);
    }

    .A {
        border-right: 2px solid var(--fg0);
    }

    .selected {
        color: var(--bg0);
        background-color: var(--fg0);
    }

    .selected:hover {
        color: var(--bg0);
        background-color: var(--fg0);
    }
</style>
