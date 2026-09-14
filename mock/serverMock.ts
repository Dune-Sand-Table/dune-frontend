import {WebSocketServer} from 'ws';
import {API} from "../src/types/API";
import {serverMockLogic} from "./serverMockLogic.js";
import {post} from "./post";

export default function serverPlugin() {
    const mock = serverMockLogic();
    const wss = new WebSocketServer({port: 8089});
    wss.on('connection', (ws) => {
        console.log('ws connected');
        mock.setEmit((obj) => ws.send(obj))
        ws.on('close', () => {
            mock.setEmit(null);
            console.log('ws disconnected');
        });
    });
    return {
        name: 'server-plugin',
        configureServer(server) {
            const OK = {result: 'ok'};
            post(server, API.GALLERY_LIST, async () => {
                return await mock.getGalleryList();
            });
            post(server, API.GALLERY_UPLOAD, async (buf) => {
                return await mock.galleryUpload(buf)
            });
            post(server, API.GALLERY_METADATA, async (json, headers) => {
                await mock.galleryUploadMetaData(json, headers["x-id"]);
                return OK
            });
            post(server, API.GALLERY_ITEM, async (json, headers) => {
                return await mock.galleryGetItem(json, headers["x-id"])
            });
            post(server, API.GALLERY_DELETE, async (json, headers) => {
                await mock.galleryDelete(headers["x-id"])
                return OK
            });
            post(server, API.GALLERY_ACTIVATE, async (json, headers) => {
                await mock.galleryActivate(headers["x-id"]);
                return OK;
            });
            post(server, API.NETWORK_GET, () => {
                return mock.getNetworkSettings();
            });
            post(server, API.NETWORK_SET, async x => {
                await mock.setNetworkSettings(x)
                return OK
            });
            Object.entries(API)
                .filter(([_, route]) => route.includes("signal"))
                .forEach(([name, route]) => {
                    post(server, route, async () => {
                        mock.sendSignal(name);
                        return OK
                    });
                })
        }
    };
}
