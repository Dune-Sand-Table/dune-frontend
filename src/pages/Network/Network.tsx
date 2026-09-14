import * as React from 'preact';
import { useNetworkStore } from '../../store/NetworkStore/useNetworkStore';
import './Network.css';
import {Input} from "../../components/Input/Input";
import {Switch} from "../../components/Switch/Switch";
import {JSX} from "preact";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";

export function Network() {
    const {
        mode, wifi_ssid, wifi_password, ap_ssid, ap_password, isLoading, isSaved, error,
        toggleMode, setField, saveSettings
    } = useNetworkStore();

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        saveSettings();
    };

    if (isLoading && !isSaved) return <div className="loader">Loading settings...</div>;
    if (isSaved) return <div className="status">Settings saved!<br/>ESP32 is restarting...</div>;

    let isAP = mode === "ap";

    return (
        <PageWrapper title={"Network"}>
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="switch-group">
                    <div className="switch-container">
                        <span className="switch-label">Operation Mode</span>
                        <Switch checked={isAP} onChange={toggleMode}/>
                        <span className="mode-text">{isAP ? 'Access Point (AP)' : 'Wi-Fi (STA)'}</span>
                    </div>
                </div>

                {!isAP ? (
                    <div id="staFields">
                        <Input
                            value={wifi_ssid}
                            onChange={(e: any) => setField('wifi_ssid', e.target.value)}
                            label={"Wi-Fi SSID (Router)"}
                        />
                        <Input
                            value={wifi_password}
                            onChange={(e: any) => setField('wifi_password', e.target.value)}
                            label={"Wi-Fi Password"}
                        />
                    </div>
                ) : (
                    <div id="apFields">
                        <Input
                            value={ap_ssid}
                            onChange={(e: any) => setField('ap_ssid', e.target.value)}
                            label={"ESP32 AP SSID"}
                        />
                        <Input
                            value={ap_password}
                            onChange={(e: any) => setField('ap_password', e.target.value)}
                            label={"ESP32 AP Password"}
                        />
                    </div>
                )}

                <button type="submit">Apply + Reboot</button>
            </form>
        </PageWrapper>
    );
}
