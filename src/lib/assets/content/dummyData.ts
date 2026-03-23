import type { WordDef } from "$lib/components/word_def_item/WordDefinitionItem.svelte";
import type { WordConnection } from "../../../routes/map/[word]/+page.svelte";

export const testCreeWordDef: WordDef = {
    primaryText: "nipâw",

    wordType: "Verb",
    descriptions: [
        "He or she sleeps sleeps sleeps sleeps sleeps sleeps",
        "He or she is sleeping"
    ],
    // If your app supports French or another secondary language for definitions:

    detailWord_Ling: "VAI (Verb Animate Intransitive)",
    morphs: [
        { description: "Verb stem (to sleep)", word: "kinipân" },
        { description: "3rd person singular suffix", word: "ê-nipâyâhk" }
    ],

    audioKey: "cree_nipaw_01",
    imageSrc: [
        "/assets/images/verbs/sleeping.jpg"
    ]
};



export const seeDefinitions: WordDef[] = [
    {
        primaryText: "wâpiw",
        wordType: "Verb",
        descriptions: ["He/she sees", "He/she has eyesight", "He/she can see"],
        detailWord_Ling: "VAI (Verb Animate Intransitive)",
        morphs: [
            { description: "root for sight/light", word: "wâpi-" },
            { description: "3rd person singular suffix", word: "-w" }
        ],
        audioKey: "wapiw_01"
    },
    {
        primaryText: "wâpahtam",
        wordType: "Verb",
        descriptions: ["He/she sees it (inanimate)", "Looking at a book, a house, or the weather"],
        detailWord_Ling: "VTI (Verb Transitive Inanimate)",
        morphs: [
            { description: "root for sight", word: "wâpa-" },
            { description: "inanimate transitive final", word: "-ht" },
            { description: "3rd person singular", word: "-am" }
        ],
        audioKey: "wapahtam_01"
    },
    {
        primaryText: "wâpamêw",
        wordType: "Verb",
        descriptions: ["He/she sees him/her (animate)", "Looking at a person, an animal, or the sun"],
        detailWord_Ling: "VTA (Verb Transitive Animate)",
        morphs: [
            { description: "root for sight", word: "wâpa-" },
            { description: "animate transitive final", word: "-m" },
            { description: "3rd person animate object suffix", word: "-êw" }
        ],
        audioKey: "wapamew_01"
    }
];


export const dummyCreeData: WordConnection[] = [
    {
        primaryText: "atāskēwin",
        secondaryText: "work / a job",
        description: [
            "Refers to the act of working or a specific occupation.",
            "Derived from the root 'atāskē-', meaning to work."
        ],
        connections: [
            {
                primaryText: "atāskēwak",
                secondaryText: "they are working",
                description: ["The plural present tense form of the verb."],
                connections: []
            },
            {
                primaryText: "atāskēwikamik",
                secondaryText: "office / workplace",
                description: ["Literally 'work-house'."],
                connections: []
            }
        ]
    },
    {
        primaryText: "maskwa",
        secondaryText: "bear",
        description: [
            "A black bear.",
            "Often used in traditional storytelling and kinship terms."
        ],
        connections: [
            {
                primaryText: "maskosis",
                secondaryText: "bear cub",
                description: ["The diminutive form, adding '-is' to the end."],
                connections: []
            },
            {
                primaryText: "maskwamiy",
                secondaryText: "ice",
                description: [
                    "A phonetic relative, though the cultural connection involves the bear's hibernation cycle."
                ],
                connections: []
            }
        ]
    },
    {
        primaryText: "mīcisowin",
        secondaryText: "food / the act of eating",
        description: [
            "A general term for nourishment.",
            "Central to community gatherings."
        ],
        connections: [
            {
                primaryText: "mīcisowikamik",
                secondaryText: "restaurant / dining hall",
                description: ["Literally 'eating-house'."],
                connections: []
            },
            {
                primaryText: "mīciwinis",
                secondaryText: "snack",
                description: ["Small or light food item."],
                connections: []
            }
        ]
    },
    {
        primaryText: "nîpisiy",
        secondaryText: "willow",
        description: [
            "A flexible tree or shrub often found near water.",
            "Used traditionally for making baskets and medicinal tea."
        ],
        connections: [
            {
                primaryText: "nîpiy",
                secondaryText: "water",
                description: [
                    "The essential element for life.",
                    "Often found where nîpisiy grows."
                ],
                connections: [
                    {
                        primaryText: "maskikiy",
                        secondaryText: "medicine",
                        description: [
                            "Traditional healing substances derived from the land.",
                            "Many medicines are prepared by boiling plants in water."
                        ],
                        connections: [] // 2nd degree from nîpisiy
                    }
                ]
            },
            {
                primaryText: "mitis",
                secondaryText: "tree",
                description: [
                    "A general term for a tree or piece of wood."
                ],
                connections: [
                    {
                        primaryText: "sakâw",
                        secondaryText: "forest / wooded area",
                        description: [
                            "An area thick with trees."
                        ],
                        connections: [] // 2nd degree from nîpisiy
                    }
                ]
            }
        ]
    }
];