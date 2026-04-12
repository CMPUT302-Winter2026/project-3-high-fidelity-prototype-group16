<script lang="ts">
    import CreeSearchComp from "$lib/components/CreeSearchComp.svelte";
    import PushButton from "$lib/components/PushButton.svelte";
    import IconButton from "$lib/components/IconButton.svelte";

    let text: string = $state("");
</script>

<div class="mainLayout">
    <a href="/settings" class="settings-link">
        <IconButton>
            <img src="/icons/setting.svg" alt="Settings" />
        </IconButton>
    </a>
    <h1>Vocab Explorer</h1>
    <CreeSearchComp />

    {#if !text}
        <h3>Type an English or Cree word to get started!</h3>
    {/if}

    <a href="/missing/report" class="report-link">
        <PushButton>Report a Missing Word</PushButton>
    </a>
</div>

<style>
    .mainLayout {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 3rem;
        padding-top: 5rem;
        min-height: calc(100dvh - 3.5rem);
    }

    .settings-link {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
    }

    h3 {
        text-align: center;
        width: 80%;
    }

    .report-link {
        margin-top: auto;
    }
</style>
