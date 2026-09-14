import * as React from 'preact';
import "./Input.css"

export function Input({value, onChange, label}: {value: any, onChange: (e:any) => void, label: string}) {
    return <div className="floating-group">
        <input
            type="text"
            value={value}
            placeholder=" "
            onChange={onChange}
        />
        <label>
            {label}
        </label>
    </div>
}