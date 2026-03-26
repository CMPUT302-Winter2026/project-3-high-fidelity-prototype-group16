import { getMissingWords } from "$lib/firebase/api";
import type { PageLoad } from "./$types";


export const load: PageLoad = async ({ params }) => {
    return {
        missingWords: (await getMissingWords()).map((w) => w.id)
    }
};