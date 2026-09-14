import * as React from 'preact';
import "./Switch.css"

export function Switch({checked, onChange}:{checked:boolean; onChange:(e:any) => void}) {
    return <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange}/>
        <span className="slider"/>
    </label>
}