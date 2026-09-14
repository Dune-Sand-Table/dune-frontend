import {create} from 'zustand';
import {MonitorStore} from "./MonitorStore";
import {API} from "../../types/API";

export const useMonitorStore = create<MonitorStore>((
    set,
    get
) => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
        const gateway = `ws://${window.location.hostname}:${window.location.port}/ws`;
        console.log('Trying to open a WebSocket connection...');

        socket = new WebSocket(gateway);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            set({wsConnected: true});
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            set({wsConnected: false, targetPointIndex: undefined, systemState: undefined});
            reconnectTimeout = setTimeout(connect, 2000);
        };

        socket.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.targetPointIndex !== undefined) {
                    set({targetPointIndex: data.targetPointIndex});
                }
                if (data.temp !== undefined) {
                    set({temperature: data.temp});
                }
                if (data.systemState !== undefined) {
                    set({systemState: data.systemState});
                }
                if (data.currentTask) {
                    fetchCurrentPoints(data.currentTask);
                }
            } catch (err) {
                console.error('Failed to parse WebSocket JSON:', err);
            }
        };

        socket.onerror = (event: Event) => {
            console.error('WebSocket error observed:', event);
        };
    };

    connect();

    async function fetchCurrentPoints(id: string) {
        try {
            const res = await fetch(API.GALLERY_ITEM, {
                method: 'POST',
                headers: {"X-Id": id}
            });
            if (!res.ok)
                throw new Error('Error fetching points');
            const buffer = await res.arrayBuffer();
            const rawPoints = new Float32Array(buffer);
            if (rawPoints.length === 0)
                return;
            const pointsPolar: [number, number][] = [];
            for (let i = 0; i < rawPoints.length; i += 2) {
                const angle = rawPoints[i];
                const radius = rawPoints[i + 1];
                pointsPolar.push([angle, radius]);
            }
            set({pointsPolar, loadedItemId: id});
        } catch (err) {
            console.error('Failed to load points:', err);
        }
    }

    return {
        wsConnected: false
    };
});
