export enum API {
    NETWORK_SET = '/api/network/set',
    NETWORK_GET = '/api/network/get',

    GALLERY_METADATA = '/api/gallery/metadata',
    GALLERY_UPLOAD = '/api/gallery/upload',
    GALLERY_LIST = '/api/gallery/list',
    GALLERY_ITEM = '/api/gallery/item',
    GALLERY_DELETE = '/api/gallery/delete',
    GALLERY_ACTIVATE = '/api/gallery/activate',

    STOP = '/api/signal/stop',
    HOME = '/api/signal/home',
    START = '/api/signal/start',
    PAUSE = '/api/signal/pause',
    RESUME = '/api/signal/resume',
    CLEAR = '/api/signal/clear',
    REBOOT = '/api/signal/reboot',
}