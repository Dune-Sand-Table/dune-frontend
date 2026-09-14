/// <reference types="vite/client" />
/// <reference types="preact" />

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}