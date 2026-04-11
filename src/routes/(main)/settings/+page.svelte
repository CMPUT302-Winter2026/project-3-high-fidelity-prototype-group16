<script lang="ts">
    import { CreeDialects, UserPref } from "$lib/assets/shared_states/userPref.svelte";
    import ABToggle from "$lib/components/ABToggle.svelte";
    import Toggle from "$lib/components/Toggle.svelte";

    let showToast = $state(false);
    let toastTimeout: ReturnType<typeof setTimeout>;
    let initialized = false;

    $effect(() => {
        JSON.stringify(UserPref);

        if (!initialized) {
            initialized = true;
            return;
        }

        clearTimeout(toastTimeout);
        showToast = true;
        toastTimeout = setTimeout(() => (showToast = false), 2500);
    });
</script>

<div class="container">
    <h1 class="title">User Preference</h1>

    <div>
        <label for="">Display Format</label>
        <ABToggle A={"SRO"} B={"Syllabics"} bind:value={UserPref.format} />
    </div>

    <div>
        <label for="">Long Vowel</label>
        <ABToggle A={"Circumflex"} B={"Macron"} bind:value={UserPref.longVowelRep} />
    </div>

    <div>
        <Toggle label="Use Dialect Marker" bind:checked={UserPref.useDialectMarker} />
    </div>

    <div>
        <label for="dialectSelector">Default dialect</label>
        <select id="dialectSelector" name="Dialect Switcher" bind:value={UserPref.dialect}>
            {#each CreeDialects as d}
                <option> {d}</option>
            {/each}
        </select>
    </div>
</div>

{#if showToast}
    <div class="toast">Settings saved</div>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;

        padding: 2rem;
        padding-top: 0;
    }

    .toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);

        background-color: var(--fg0);
        color: var(--bk);
        font-size: 0.875rem;

        padding: 0.5rem 1.25rem;
        border-radius: 8px;

        pointer-events: none;
        animation: fadein 200ms ease-out;
    }

    @keyframes fadein {
        from { opacity: 0; transform: translateX(-50%) translateY(6px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
</style>
