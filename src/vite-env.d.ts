/// <reference types="vite/client" />
// src/env.d.ts
export {};

declare global {
    interface Window {
        wx: {
            start(args?: string[]): Promise<{ ok: boolean }>;
            stop(): Promise<{ ok: boolean }>;
            send(payload: string): Promise<{ ok: boolean; error?: string }>;
            isRunning(): Promise<{ running: boolean }>;
            onData(cb: (data: string) => void): () => void;
            onError(cb: (data: string) => void): () => void;
            onExit(cb: (info: { code: number | null; signal: string | null }) => void): () => void;
        };
    }
}
