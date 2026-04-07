<script lang="ts">
    interface Props {
        A: string;
        B: string;
        value: string;
    }

    let { A, B, value = $bindable() }: Props = $props();
</script>

<div class="container">
    <button
        type="button"
        class:selected={value === A}
        class="btn A"
        onclick={() => {
            value = A;
        }}
    >
        {A}
    </button>
    <button
        type="button"
        class:selected={value === B}
        class="btn B"
        onclick={() => {
            value = B;
        }}>{B}</button
    >
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
