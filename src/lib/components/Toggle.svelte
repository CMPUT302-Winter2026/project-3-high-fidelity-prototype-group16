<script lang="ts">
    interface Props {
        label: string;
        checked: boolean;
    }

    let { label, checked = $bindable() }: Props = $props();
</script>

<div class="container">
    <label for="check">{label}</label>
    <input id="check" type="checkbox" bind:checked class:active={checked} />
</div>

<style>
    .container {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    input#check {
        width: 2.25rem;
        height: 1.25rem;

        appearance: none;
        position: relative;

        border: 2px solid var(--fg0);
        border-radius: 999px;

        background-color: var(--bg0);

        transition:
            background-color 180ms ease-out,
            border-color 180ms ease-out;
    }

    #check::after {
        content: "";
        position: absolute;

        width: 0.85rem;
        height: calc(100% - 6px);

        top: 2px;
        left: 2px;

        border-radius: 999px;
        border: 1px solid var(--fg0);
        background-color: var(--fg0);

        transition: left 200ms ease-out;
    }

    #check.active::after {
        left: calc(100% - 0.85rem - 2px);
        background-color: var(--bg0);
    }

    #check.active {
        background-color: var(--fg0);
        border-color: var(--fg0);
    }
</style>
