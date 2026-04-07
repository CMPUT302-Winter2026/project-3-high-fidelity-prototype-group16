<script lang="ts">
    import CreeSearchComp from "$lib/components/CreeSearchComp.svelte";

    let text: string = $state("");
</script>

<div class="mainLayout">
    <h1>Vocab Explorer</h1>
    <CreeSearchComp />

    {#if !text}
        <h3>Type an English or Cree word to get started!</h3>
    {/if}
</div>

<style>
    .mainLayout {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 3rem;
        padding-top: 5rem;
    }

    h3 {
        text-align: center;
        width: 80%;
    }
</style>
