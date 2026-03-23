import { createSubscriber } from "svelte/reactivity";

export class ManualReactiveMap<K, V> {
    array: Map<K, V> = new Map<K, V>();
    #subscribe;
    #forceUpdate: (() => void) | undefined;

    constructor(arr: Array<T>) {
        this.array = arr;
        this.#subscribe = createSubscriber((update) => {
            this.#forceUpdate = update;
        });
    }

    get arr() {
        this.#subscribe();
        return this.array;
    }

    update() {
        if (!this.#forceUpdate) {
            alert("not initialized");
            return;
        }

        this.#forceUpdate();
    }
}