import {SystemState} from "./SystemState";

export interface WsMessage {
    targetPointIndex?: number;
    systemState?: SystemState;
    temp?: number;
    currentTask?: string;
}