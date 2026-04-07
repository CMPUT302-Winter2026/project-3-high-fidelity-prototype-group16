<script lang="ts">
    import { page } from "$app/state";
    import Search from "$lib/components/Search.svelte";
    import Fuse from "fuse.js";
    import type { PageData, PageProps } from "./$types";
    import { bumpVote, getMissingWords } from "$lib/firebase/api";
    import ABToggle from "$lib/components/ABToggle.svelte";
    import PushButton from "$lib/components/PushButton.svelte";

    let { data }: PageProps = $props();

    let word = $state(page.url.hash.slice(1));
    let language = $state<"English" | "Cree">("Cree");

    let searcher = $derived(
        new Fuse(data.missingWords, {
            isCaseSensitive: true,
            ignoreDiacritics: true,
            threshold: 0.45,
        }),
    );
</script>

<form
    class="container"
    onsubmit={async (e) => {
        e.preventDefault();
        await bumpVote({ id: word, votes: 0, wordType: language });
        alert(`Thanks for submitting: ${word}`);
    }}
>
    <h1>Report a Missing Word?</h1>
    <Search
        bind:text={word}
        autoCompleteProvider={(key) => {
            const res = searcher.search(key);
            return res.map((item) => item.item);
        }}
    />

    <div>
        <label for="">Language of the Word</label>
        <ABToggle A="English" B="Cree" bind:value={language} />
    </div>

    <PushButton type="submit">Submit!</PushButton>
</form>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;

        padding-top: 0;
    }
</style>
