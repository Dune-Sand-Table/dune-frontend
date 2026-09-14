import {create} from "zustand";
import {GalleryItem, GalleryStore} from "./GalleryStore";
import {sendRequest} from "../../utils/sendRequest";
import {API} from "../../types/API";

export const useGalleryStore = create<GalleryStore>((
    set,
    get
) => {

    async function ensureGalleryItemData(gi: GalleryItem): Promise<GalleryItem> {
        const res = await fetch(API.GALLERY_ITEM, {
            method: "POST",
            body: "{}",
            headers: {'Content-Type': 'application/json', 'X-Id': gi.id}
        })
        const buffer = await res.arrayBuffer();
        const raw = new Float32Array(buffer);
        const data = [];
        for (let i = 0; i < raw.length; i += 2) {
            data.push([raw[i], raw[i + 1]])
        }
        gi.data = data;
        return gi;
    }

    async function loadPageItems() {
        const {allItems, limit, offset} = get()
        const page = allItems.filter((_, i) => i >= offset && i < offset + limit);
        set({
            pageItems: await Promise.all(page.map(ensureGalleryItemData)),
            loading: false,
            hasPrev: offset > 0,
            hasNext: offset < allItems.length - limit,
            selectedItem: null
        })
    }

    (async function () {
        const allItems = await sendRequest<GalleryItem[]>(API.GALLERY_LIST);
        set({allItems});
        await loadPageItems()
    })();

    return {
        loading: true,
        allItems: [],
        pageItems: [],
        offset: 0,
        limit: 4,
        hasNext: false,
        hasPrev: false,
        selectedItem: null,
        async changePage(dir: number) {
            let {offset, limit} = get();
            offset += Math.sign(dir)*Math.abs(dir)*limit;
            set({offset})
            await loadPageItems()
        },
        select(id: string) {
            set({selectedItem: get().pageItems.find(x => x.id === id)})
        },
        async load() {
           await fetch(API.GALLERY_ACTIVATE, {
                method: "POST",
                headers: {'X-Id': get().selectedItem.id}
            });
        },
        async delete() {
            await fetch(API.GALLERY_DELETE, {
                method: "POST",
                headers: {'X-Id': get().selectedItem.id}
            });
        }
    }
});
