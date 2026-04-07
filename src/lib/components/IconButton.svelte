<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        size?: string;
        style?: string;
        class?: string;
        onclick?: (event: MouseEvent) => void;
        children?: Snippet;
    }

    let {
        type = "button",
        disabled = false,
        size = "2rem",
        style = "",
        class: className = "",
        onclick,
        children,
    }: Props = $props();
</script>

<button
    {type}
    {disabled}
    {onclick}
    class={`icon-button ${className}`}
    style={`--icon-btn-size: ${size}; ${style}`}
>
    {@render children?.()}
</button>

<style>
    .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: var(--icon-btn-size);
        height: var(--icon-btn-size);
        aspect-ratio: 1;
        padding: 0.3rem;

        border: 1px solid var(--bg1);
        border-radius: 999px;
        background-color: transparent;
        color: var(--fg0);

        transition:
            border-color 180ms ease-out,
            color 180ms ease-out,
            background-color 180ms ease-out,
            transform 120ms ease-out;
    }

    .icon-button:hover:not(:disabled) {
        border-color: var(--fg1);
        color: var(--fg1);
        background-color: var(--bg0);
    }

    .icon-button:active:not(:disabled) {
        transform: translateY(1px);
    }

    .icon-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .icon-button :global(img),
    .icon-button :global(svg) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>
