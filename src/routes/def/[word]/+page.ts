import type {  PageServerLoad } from "./$types";



export const load: PageServerLoad = async ({ params }) => {

    return {
        test: "abc",
        param: params.word
    }
};