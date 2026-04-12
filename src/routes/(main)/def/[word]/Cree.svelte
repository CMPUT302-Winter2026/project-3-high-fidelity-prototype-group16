<script lang="ts">
    import type { CreeWord } from "$lib/assets/content/dummy/types";
    import { pushState } from "$app/navigation";
    import { page } from "$app/state";
    import { CreeFormatTranslate } from "$lib/assets/cree_util/cree_format_translate";
    import {
        CreeDialects,
        UserPref,
        type CreeDialect,
    } from "$lib/assets/shared_states/userPref.svelte";
    import ImageModal from "$lib/components/ImageModal.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import PushButton from "$lib/components/PushButton.svelte";
    import CreeWordDetails from "$lib/components/word_def_item/CreeWordDetails.svelte";

    interface Props {
        word: CreeWord;
    }

    let { word }: Props = $props();

    let dialect: CreeDialect = $state(UserPref.dialect);
    const dummyImages = ["/icons/photo.svg", "/icons/photo.svg", "/icons/photo.svg"];
    type ModalPageState = App.PageState & { imageModalWord?: string };
    let modalState = $derived(page.state as ModalPageState);
    let showImageModal = $derived(modalState.imageModalWord === word.primaryText);

    function openImageModal() {
        if (showImageModal) {
            return;
        }

        pushState("", {
            ...modalState,
            imageModalWord: word.primaryText,
        });
    }

    function closeImageModal() {
        if (!showImageModal) {
            return;
        }

        history.back();
    }
</script>

<div class="title">
    <h1>{CreeFormatTranslate(word.primaryText, { ...UserPref })}</h1>
    <span>
        {word.wordType} ({word.detailedWordType})
    </span>
    <div class="toolButtons">
        <div class="dialectWrapper">
            <label for="dialect">Dialects</label>
            <select name="Dialect Switcher" id="dialect" bind:value={dialect}>
                {#each CreeDialects as d (d)}
                    <option> {d}</option>
                {/each}
            </select>
        </div>
        <IconButton
            onclick={() => {
                if (UserPref.format == "SRO") {
                    UserPref.format = "Syllabics";
                } else {
                    UserPref.format = "SRO";
                }
            }}
        >
            <img src="/icons/translate.svg" alt="SRO/Cree Syllabic toggle" />
        </IconButton>
        <IconButton
            onclick={() => {
                alert(
                    `Mock audio playback, Chosen dialect: ${dialect}, chosen word ${word.primaryText}`,
                );
            }}
        >
            <img src="/icons/speaker.svg" alt="speaker icon button" />
        </IconButton>

        <IconButton class="iconBtn" onclick={openImageModal}>
            <img src="/icons/photo.svg" alt=" icon button" />
        </IconButton>
    </div>
</div>

<div class="content">
    {#each word.descriptions as desc, idx (`${idx}-${desc}`)}
        <div class="wordDesc">
            <h3>{idx + 1}. {desc}</h3>
        </div>
    {/each}

    <a href="/map/{word.primaryText}">
        <PushButton>
            {#snippet prefix()}
                <img src="/icons/map.svg" alt="" style="width: 1.5rem;" />
            {/snippet}
            Related Words
        </PushButton>
    </a>

    <CreeWordDetails {word} />

    <ImageModal
        open={showImageModal}
        onclose={closeImageModal}
        subjectLabel={CreeFormatTranslate(word.primaryText, { ...UserPref })}
        images={dummyImages}
    />
</div>

<style>
    h1 {
        margin: 0;
        line-height: 4rem;
    }

    h3 {
        margin: 1rem 0;
    }
    .title {
        display: flex;
        flex-direction: column;

        gap: 0.5rem;
        align-items: start;

        padding: 0rem 2rem;
    }

    .toolButtons {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: flex-end;

        width: 100%;
    }

    .dialectWrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        margin-right: auto;
    }

    .dialectWrapper label {
        font-size: small;
        font-weight: 600;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        padding: 0rem 2rem 2rem 2rem;
    }
</style>
