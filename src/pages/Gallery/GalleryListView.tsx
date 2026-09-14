import {useGalleryStore} from "../../store/GalleryStore/useGalleryStore";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";
import {GalleryItemDisplay} from "./GalleryItemDisplay";
import * as React from "preact";
import {useMonitorStore} from "../../store/MonitorStore/useMonitorStore";
import {SystemState} from "../../types/SystemState";

const validStatesToLoad = [
    SystemState.HOMING,
    SystemState.UNHOMED,
    SystemState.IDLE
]

export function GalleryListView() {
    const changePage = useGalleryStore(x => x.changePage);
    const select = useGalleryStore(x => x.select);
    const pageItems = useGalleryStore(x => x.pageItems);
    const hasNext = useGalleryStore(x => x.hasNext);
    const hasPrev = useGalleryStore(x => x.hasPrev);
    const selectedItem = useGalleryStore(x => x.selectedItem);
    const loadedItemId = useMonitorStore(x => x.loadedItemId);
    const systemState = useMonitorStore(x => x.systemState);
    const load = useGalleryStore(x => x.load)
    const del = useGalleryStore(x => x.delete)

    const deleteDisabled = !selectedItem || loadedItemId === selectedItem?.id
    const loadDisabled = !selectedItem || loadedItemId === selectedItem?.id || !validStatesToLoad.includes(systemState);
    return (
        <PageWrapper title={"Gallery"}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, minHeight: 362}}>
                {pageItems.map(x => <div onClick={() => select(x.id)}>
                    <GalleryItemDisplay
                        item={x}
                        selected={selectedItem?.id === x.id}
                        loaded={loadedItemId === x.id}
                    />
                </div>)}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: 5}}>
                <button onClick={() => changePage(-1)} disabled={!hasPrev}>{"<<"}</button>
                <button onClick={del} disabled={deleteDisabled}>DELETE</button>
                <button onClick={load} disabled={loadDisabled}>LOAD</button>
                <button onClick={() => changePage(+1)} disabled={!hasNext}>{">>"}</button>
            </div>
        </PageWrapper>
    );
}