/**
 *
 *  /words/{wordName} -> {
 *      wordType: cree/eng
 *      votes: number
 * }
 */

import { db } from "$lib/firebase/config";
import { collection, doc, getDocs, increment, setDoc } from "firebase/firestore/lite";
import Fuse from "fuse.js";


export interface MissingWord {
    id: string,
    wordType: 'Cree' | 'English';
    votes: number;
}

export async function getMissingWords() {
    const wordsCol = collection(db, "/words",);

    const docs = await getDocs(wordsCol);

    const words = docs.docs.map(w => w.data());

    return words as MissingWord[];
}

export async function bumpVote(word: MissingWord) {

    await setDoc(doc(db, `/words/${word.id}`),
        {
            ...word,
            votes: increment(1)
        },
        {
            merge: true
        }
    );
}