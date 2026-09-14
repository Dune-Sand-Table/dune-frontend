import {SystemState} from "../../types/SystemState";

export interface MonitorStore {
    systemState?: SystemState;
    pointsPolar?: [ number, number ][];
    targetPointIndex?: number;
    temperature?: number;
    wsConnected: boolean;
    loadedItemId?: string;
}