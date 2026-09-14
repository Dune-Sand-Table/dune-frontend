import {readFileSync} from "fs";
import {mkdir, readdir, readFile, stat, unlink, writeFile} from "node:fs/promises";
import {SystemState} from "../src/types/SystemState";
import {WsMessage} from "../src/types/WsMessage";

const GALLERY_DIR = './mock/gallery';

export function serverMockLogic() {
    let systemState = SystemState.INITIALIZING
    const networkJson = 'mock/network.json';

    const networkSettings = JSON.parse(readFileSync(networkJson).toString())
    const currentTask = {
        id: null,
        points: null,
        targetPointIndex: null
    }

    ensureDir(GALLERY_DIR)


    let emit;
    let outgoingMsg: WsMessage = {}

    setInterval(async () => {
        if (systemState === SystemState.INITIALIZING) {
            updateSystemState(SystemState.UNHOMED)
        } else if (systemState === SystemState.STARTING) {
            updateSystemState(SystemState.RUNNING)
        } else if (systemState === SystemState.PAUSING) {
            updateSystemState(SystemState.PAUSED)
        } else if (systemState === SystemState.STOPPING) {
            updateSystemState(SystemState.IDLE)
            updateTargetPointIndex(-1)
        } else if (systemState === SystemState.RESUMING) {
            updateSystemState(SystemState.RUNNING)
        } else if (systemState === SystemState.REBOOTING) {
            await new Promise((resolve) => setTimeout(resolve, 900))
            console.log('reboot')
            updateSystemState(SystemState.IDLE)
        }else if (systemState === SystemState.HOMING) {
            updateSystemState(SystemState.IDLE)
        }

        updateTemp();
    }, 1000)

    setInterval(() => {
        if (systemState === SystemState.RUNNING && currentTask.id) {
            if (currentTask.targetPointIndex >= currentTask.points.byteLength / 8) {
                updateSystemState(SystemState.STOPPING)
            } else {
                updateTargetPointIndex(currentTask.targetPointIndex + 1);
            }
        }
        emit && Object.keys(outgoingMsg).length && emit(JSON.stringify(outgoingMsg))
        outgoingMsg = {}
    }, 100)

    function updateTemp() {
        if (Math.random() < 0.9)
            return
        outgoingMsg.temp = 50 + (Math.random() * 5 | 0)
    }

    function updateTargetPointIndex(x) {
        currentTask.targetPointIndex = x
        outgoingMsg.targetPointIndex = currentTask.targetPointIndex;
    }

    function updateSystemState(state) {
        systemState = state;
        outgoingMsg.systemState = state;
    }

    const signalHandlers = {
        start() {
            if (systemState === SystemState.IDLE) {
                currentTask.id && updateSystemState(SystemState.STARTING)
            }
        },
        stop() {
            if (systemState === SystemState.RUNNING || systemState === SystemState.PAUSED)
                updateSystemState(SystemState.STOPPING)
        },
        pause() {
            if (systemState === SystemState.RUNNING)
                updateSystemState(SystemState.PAUSING)
        },
        resume() {
            if (systemState === SystemState.PAUSED) {
                updateSystemState(SystemState.RESUMING)
            }
        },
        clear() {
            if (systemState === SystemState.ERROR)
                updateSystemState(SystemState.IDLE)
        },
        reboot() {
            updateSystemState(SystemState.REBOOTING)
        },
        home() {
            if (systemState === SystemState.UNHOMED)
                updateSystemState(SystemState.HOMING)
        }
    }

    return {
        setEmit(callback) {
            emit = callback
            callback && callback(JSON.stringify({
                systemState,
                targetPointIndex: currentTask.targetPointIndex,
                temp: 52,
                currentTask: currentTask.id
            }))
        },
        getNetworkSettings() {
            return networkSettings;
        },
        async setNetworkSettings(settings) {
            Object.assign(networkSettings, settings);
            console.log('update network settings', networkSettings)
            await writeFile(networkJson, JSON.stringify(settings, null, 4))
        },
        sendSignal(signal) {
            signalHandlers[signal.toLowerCase()]()
        },
        async getGalleryList(): Promise<Object[]> {
            const files = (await readdir(GALLERY_DIR))
                .filter(x => x.endsWith(".json"))
                .map(async x => await readFile(`${GALLERY_DIR}/${x}`));
            return (await Promise.all(files)).map(x => JSON.parse("" + x));
        },
        async galleryUpload(buf): Promise<{ id: string }> {
            const id = [...Array(8)]
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("");
            await mkdir(GALLERY_DIR, {recursive: true})
            await writeFile(`${GALLERY_DIR}/${id}.bin`, Buffer.from(buf));
            return {id}
        },
        async galleryUploadMetaData(json, id) {
            await writeFile(`${GALLERY_DIR}/${id}.json`, JSON.stringify(json));
        },
        async galleryGetItem(json, id) {
            return await readFile(`${GALLERY_DIR}/${id}.bin`);
        },
        async galleryActivate(id) {
            currentTask.id = id;
            currentTask.targetPointIndex = 0;
            currentTask.points = await readFile(`${GALLERY_DIR}/${id}.bin`);
            outgoingMsg.currentTask = id;
        },
        async galleryDelete(id) {
            await unlink(`${GALLERY_DIR}/${id}.bin`)
            await unlink(`${GALLERY_DIR}/${id}.json`)
        }
    }
}

async function ensureDir(path){
    try {
        await mkdir(path)
    } catch (e) {
    }
}