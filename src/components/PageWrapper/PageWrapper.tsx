import * as React from 'preact';
import {PropsWithChildren} from "preact/compat";

export function PageWrapper(props: PropsWithChildren<{title: string}>) {
    return <div style={{minWidth: 400}} className={"box compact-form"}>
        <h2>{props.title}</h2>
        {props.children}
    </div>
}