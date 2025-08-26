import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('wx', {
  start: (args?: string[]) => ipcRenderer.invoke('wx:start', args),
  stop: () => ipcRenderer.invoke('wx:stop'),
  send: (payload: string) => ipcRenderer.invoke('wx:send', payload),
  isRunning: () => ipcRenderer.invoke('wx:isRunning'),
  onData: (cb: (data: string) => void) => {
    const listener = (_e: Electron.IpcRendererEvent, data: string) => cb(data);
    ipcRenderer.on('wx:data', listener);
    return () => ipcRenderer.removeListener('wx:data', listener);
  },
  onError: (cb: (data: string) => void) => {
    const listener = (_e: Electron.IpcRendererEvent, data: string) => cb(data);
    ipcRenderer.on('wx:error', listener);
    return () => ipcRenderer.removeListener('wx:error', listener);
  },
  onExit: (cb: (info: { code: number | null; signal: NodeJS.Signals | null }) => void) => {
    const listener = (_e: Electron.IpcRendererEvent, info: any) => cb(info);
    ipcRenderer.on('wx:exit', listener);
    return () => ipcRenderer.removeListener('wx:exit', listener);
  },
});
