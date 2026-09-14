import { create } from 'zustand';
import {API} from "../../types/API";
import {sendRequest} from "../../utils/sendRequest";
import {NetworkSettings} from "../../types/NetworkSettings";

export const useNetworkStore = create<NetworkStore>((
    set,
    get
) => {

    (async function  () {
        set({isLoading: true, error: null});
        try {
            set({
                ...await sendRequest<NetworkSettings>(API.NETWORK_GET),
                isLoading: false
            });
        } catch (err: any) {
            set({error: err.message, isLoading: false});
        }
    })();

    return ({

        toggleMode() {
            set((s) => ({mode: s.mode === "ap" ? "wifi" : "ap"}))
        },

        setField(field, value) {
            set({[field]: value})
        },

        saveSettings: async () => {
            set({isLoading: true, error: null});
            const {mode, wifi_ssid, wifi_password, ap_ssid, ap_password} = get();
            const res = await fetch(API.NETWORK_SET, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    mode,
                    wifi_ssid,
                    wifi_password,
                    ap_ssid,
                    ap_password
                })
            });
            set(res.ok ? {isSaved: true, isLoading: false} : {error: 'Failed to save settings', isLoading: false});
        }
    });
});
