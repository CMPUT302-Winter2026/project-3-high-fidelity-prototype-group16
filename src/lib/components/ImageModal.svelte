<script lang="ts">
    import Portal from "$lib/components/Portal.svelte";

    interface Props {
        open: boolean;
        subjectLabel: string;
        images: string[];
        onclose?: () => void;
    }

    let { open, subjectLabel, images, onclose }: Props = $props();

    function closeModal() {
        onclose?.();
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeModal();
        }
    }

    $effect(() => {
        if (!open) {
            return;
        }

        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<Portal targetId="main-layout">
    {#if open}
        <div
            class="overlay"
            role="button"
            tabindex="0"
            aria-label="Close image modal backdrop"
            onclick={handleBackdropClick}
            onkeydown={handleKeydown}
        >
            <div
                class="modal"
                role="dialog"
                aria-modal="true"
                aria-label={`Images for ${subjectLabel}`}
            >
                <header class="header">
                    <h2>Subject Images</h2>
                    <button
                        class="closeBtn"
                        type="button"
                        onclick={closeModal}
                        aria-label="Close image modal"
                    >
                        Close
                    </button>
                </header>

                <p class="subject">Current subject: {subjectLabel}</p>

                <ul class="imageList thinScroll">
                    {#each images as src, idx (`${src}-${idx}`)}
                        <li class="imageItem">
                            <div class="imageFrame">
                                <img {src} alt={`${subjectLabel} placeholder image ${idx + 1}`} />
                                <span class="imageLabel">{subjectLabel}-image{idx + 1}</span>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    {/if}
</Portal>

<style>
    .overlay {
        position: absolute;
        inset: 0;
        z-index: 1200;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(0, 0, 0, 0.55);
        padding: 1rem;
    }

    .modal {
        width: min(100%, 360px);
        max-height: min(78dvh, 620px);
        overflow: hidden;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        border-radius: 12px;
        border: 1px solid var(--lightGrey);
        background-color: var(--bg0);
        padding: 0.9rem;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .header h2 {
        margin: 0;
        font-size: 1rem;
    }

    .closeBtn {
        border: 1px solid var(--lightGrey);
        background: var(--bg1);
        color: var(--fg0);
        border-radius: 8px;
        padding: 0.3rem 0.6rem;
        font-size: 0.875rem;
    }

    .subject {
        margin: 0;
        font-size: 0.875rem;
        color: var(--grey);
    }

    .imageList {
        margin: 0;
        padding: 0;
        list-style: none;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        overflow-y: auto;
    }

    .imageItem {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .imageFrame {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 8px;
        border: 1px solid var(--lightGrey);
        background: linear-gradient(145deg, #d7d7d7, #c2c2c2);
    }

    .imageFrame img {
        width: 2rem;
        height: 2rem;
        opacity: 0.65;
    }

    .imageLabel {
        position: absolute;
        left: 0.5rem;
        bottom: 0.5rem;

        font-size: 0.78rem;
        line-height: 1;
        color: var(--fg0);
        background-color: color-mix(in srgb, var(--bg0) 80%, transparent);
        border: 1px solid color-mix(in srgb, var(--fg0) 20%, transparent);
        border-radius: 6px;
        padding: 0.2rem 0.35rem;
    }

    @media (max-width: 360px) {
        .overlay {
            padding: 0.5rem;
        }

        .modal {
            width: 100%;
            max-height: 84dvh;
        }
    }
</style>
