import * as React from 'preact';
import {GalleryListView} from "./GalleryListView";

// const formulas = [
//     "a/100 + sin(a*10)*0.1+0.4",
//     "sin(a*2.5)*0.4+0.6",
//     "sin(a*2.1)*0.44+0.56",
//     "sin(a*1.1)*0.44+0.56",
// ]

export function Gallery() {
    // const selectedItem = useGalleryStore(x => x.selectedItem);
    // if (selectedItem)
    //     return <GallerySelectedItemView item={selectedItem}/>
    return <GalleryListView/>
}

