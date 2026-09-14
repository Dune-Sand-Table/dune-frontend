interface NetworkStoreState {
    mode?: string;
    wifi_ssid?: string;
    wifi_password?: string;
    ap_ssid?: string;
    ap_password?: string;
}

interface NetworkStore extends NetworkStoreState {
    isLoading?: boolean;
    isSaved?: boolean;
    error?: string | null;
    toggleMode: () => void;
    setField: (field: keyof NetworkStoreState, value: string) => void;
    saveSettings: () => Promise<void>;
}
