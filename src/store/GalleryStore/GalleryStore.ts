
export interface GalleryItem{
    points: number;
    id: string;
    name: string;
    data?: [number,number][];
}

export interface GalleryStore {
    loading: boolean;
    allItems: GalleryItem[];
    pageItems: GalleryItem[];
    selectedItem: GalleryItem;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
    changePage(dir: number);
    select(id: string);
    load();
    delete();
    loadPageItems()
}