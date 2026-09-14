import * as React from 'preact';
import './Navbar.css';
import {PropsWithChildren} from "preact/compat";
import { Link } from 'wouter';

export function Navbar() {
    return <nav className="main-navbar">
        <Navigation to="/">Monitor</Navigation>
        <Navigation to="/gallery">Gallery</Navigation>
        <Navigation to="/generator">Generator</Navigation>
        <Navigation to="/network">Settings</Navigation>
    </nav>;
}

function Navigation({children, to}: PropsWithChildren<{ to: string }>) {
    const className = (x:any) => x.isActive ? "nav-item active" : "nav-item";
    return <Link to={to} className={className}>{children}</Link>
}

