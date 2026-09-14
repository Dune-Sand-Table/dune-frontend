import * as React from 'preact';
import {Navbar} from "../NavBar/NavBar";

import "./AppLayout.css"
import {PropsWithChildren} from "preact/compat";

export function AppLayout({children}: PropsWithChildren<{}>) {
    return <div className="app-layout">
        <Navbar/>
        {children}
    </div>;
}
