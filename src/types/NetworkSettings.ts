export interface NetworkSettings {
    mode: "wifi" | "ap";
    wifi_ssid: string;
    wifi_password: string;
    ap_ssid: string;
    ap_password: string;
}