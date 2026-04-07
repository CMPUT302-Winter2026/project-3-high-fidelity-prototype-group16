<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        onclick?: (event: MouseEvent) => void;
        prefix?: Snippet;
        postfix?: Snippet;
        children?: Snippet;
    }

    let { type = "button", disabled = false, onclick, prefix, postfix, children }: Props = $props();
</script>

<button {type} {disabled} class="push-btn" {onclick}>
    {#if prefix}
        <span class="adornment prefix" aria-hidden="true">{@render prefix()}</span>
    {/if}

    <span class="content">{@render children?.()}</span>

    {#if postfix}
        <span class="adornment postfix" aria-hidden="true">{@render postfix()}</span>
    {/if}
</button>

<style>
    .push-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        width: fit-content;
        max-height: 2.5rem;
        padding: 0.5rem 0.75rem;

        border: 2px solid var(--fg0);
        border-radius: 8px;
        background-color: var(--bg0);
        color: var(--fg0);

        transition:
            background-color 180ms ease-out,
            color 180ms ease-out,
            border-color 180ms ease-out,
            transform 120ms ease-out;
    }

    .push-btn:hover:not(:disabled) {
        background-color: var(--bg1);
        border-color: var(--fg1);
        color: var(--fg1);
    }

    .push-btn:active:not(:disabled) {
        background-color: var(--fg1);
        border-color: var(--fg0);
        color: var(--bg0);
        transform: translateY(2px);
    }

    .push-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .adornment {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: fit-content;

        height: 2rem;
        max-height: 2rem;
    }

    .content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
    }
</style>
