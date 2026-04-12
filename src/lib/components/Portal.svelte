<script lang="ts">
    import { mount, onMount, unmount } from "svelte";
    import type { Snippet } from "svelte";

    interface Props {
        targetId: string;
        children: Snippet;
    }

    let { targetId, children }: Props = $props();

    onMount(() => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
            return;
        }

        const instance = mount(children, {
            target: targetElement,
        });

        return () => {
            unmount(instance);
        };
    });
</script>
