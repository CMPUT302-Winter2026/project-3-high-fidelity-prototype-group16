<script lang="ts">
    import { getMissingWords as getMissingWords } from "$lib/firebase/api";

    const dataPromise = getMissingWords();
</script>

<div class="container">
    <h1>Missing Words</h1>
    {#each (await dataPromise).sort((a, b) => {
        return a.votes - b.votes;
    }) as item, index}
        <div class="missingItem">
            <span>Word: {item.id}</span>
            <span>Type: {item.wordType}</span>
            <span>Votes: {item.votes}</span>
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;

        gap: 1rem;
        align-items: center;

        padding: 2rem;
    }

    .missingItem {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        border: 1px solid var(--black);
        border-radius: 5px;

        padding: 1rem 1.5rem;
    }
</style>
