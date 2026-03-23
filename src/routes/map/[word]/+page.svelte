<script lang="ts" module>
    export interface WordConnection {
        primaryText: string;
        secondaryText: string;

        description: string[];

        connections: WordConnection[];
    }

    type WordGraphDesc = Omit<WordConnection, "connections">;
</script>

<script lang="ts">
    import { dummyCreeData } from "$lib/assets/content/dummyData";
    import { SimObj, simulate } from "$lib/components/graph/simulations.svelte";
    import { Vector2 } from "$lib/components/graph/vector2";
    import { onDestroy, onMount } from "svelte";

    import type { PageProps } from "./$types";

    let { params }: PageProps = $props();

    const data = dummyCreeData;

    const objs = new Map([
        ["1", new SimObj(Vector2.ZERO, Vector2.ZERO, 100, "1", 1)],
        ["2", new SimObj(Vector2.ONE.muli(100), Vector2.ZERO, 100, "2", 1)],
        ["3", new SimObj(Vector2.ONE.muli(-100), Vector2.ZERO, 100, "3", 1)],
        ["4", new SimObj(Vector2.UNIT_X.muli(100), Vector2.ZERO, 100, "4", 1)],
    ]);
    const connections = new Map([
        ["1", "2"],
        ["1", "3"],
        ["3", "4"],
    ]);

    let animationId = -1;
    onMount(() => {
        let lastFrameTime = 0;
        function update(t: number) {
            const dt = t - lastFrameTime;

            simulate(objs, connections, dt);
            lastFrameTime = t;

            animationId = requestAnimationFrame(update);
        }
        animationId = requestAnimationFrame(update);
    });

    onDestroy(() => {
        if (animationId != -1) {
            cancelAnimationFrame(animationId);
        }
    });
</script>

<div class="container">
    {#each objs.values() as item}
        <div class="square" style="--x: {item.pos.x}px; --y: {item.pos.y}px;">
            {item.id}
        </div>
    {/each}
</div>

<style>
    .square {
        color: var(--white);
        font-size: x-large;

        display: flex;
        position: absolute;

        transform: translate(var(--x), var(--y));

        left: 0;
        top: 0;

        width: 100px;
        height: 100px;
        background-color: var(--black);
    }
</style>
