import * as React from 'preact';
import {useMonitorStore} from "../../store/MonitorStore/useMonitorStore";
import {PreviewCanvas} from "../../components/PreviewCanvas/PreviewCanvas";
import {sendRequest} from "../../utils/sendRequest";
import {API} from "../../types/API";
import {SystemState} from "../../types/SystemState";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";

export function LiveMonitor() {
    const {
        pointsPolar,
        targetPointIndex,
        temperature,
        systemState
    } = useMonitorStore();

    return <PageWrapper title={"Monitor"}>
        <PreviewCanvas
            pointsPolar={pointsPolar}
            targetPointIndex={targetPointIndex}
            leftText={systemState}
            rightText={temperature? temperature+"°C" : ""}
        />
        <div style={{display: 'flex', flexDirection: 'row', gap: 5}}>
            {canHome(systemState) && <button onClick={() => sendRequest(API.HOME)}>HOME</button>}
            {canStart(systemState) && <button onClick={() => sendRequest(API.START)}>START</button>}
            {canResume(systemState) && <button onClick={() => sendRequest(API.RESUME)}>RESUME</button>}
            {canPause(systemState) && <button onClick={() => sendRequest(API.PAUSE)}>PAUSE</button>}
            {canStop(systemState) && <button onClick={() => sendRequest(API.STOP)}>STOP</button>}
            {canClear(systemState) && <button onClick={() => sendRequest(API.CLEAR)}>CLEAR</button>}
        </div>

    </PageWrapper>;
}

function canHome(systemState?: SystemState) {
    return systemState == SystemState.UNHOMED
}

function canStart(systemState?: SystemState) {
    return systemState == SystemState.IDLE
}

function canResume(systemState?: SystemState) {
    return systemState == SystemState.PAUSED
}

function canPause(systemState?: SystemState) {
    return systemState === SystemState.RUNNING
}

function canStop(systemState?: SystemState) {
    return systemState === SystemState.PAUSED || systemState === SystemState.RUNNING;
}

function canClear(systemState?: SystemState) {
    return systemState === SystemState.ERROR;
}
