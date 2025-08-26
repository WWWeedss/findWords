import { app, BrowserWindow, ipcMain  } from 'electron'
import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let worker: ChildProcessWithoutNullStreams | null = null;

function getExePath() {
  // app.isPackaged 为 true 时走打包后的 resources 目录
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'wx_listener.exe');
  }
  // 开发环境：从项目根目录的 resources/ 找
  return path.join(process.cwd(), 'resources', 'wx_listener.exe');
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function startWorker(args: string[] = []) {
  if (worker) return; // 已经在跑
  const exe = getExePath();

  worker = spawn(exe, args, {
    cwd: path.dirname(exe),
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  // 把子进程输出转发到渲染进程
  worker.stdout.on('data', (buf) => {
    win?.webContents.send('wx:data', buf.toString());
  });
  worker.stderr.on('data', (buf) => {
    win?.webContents.send('wx:error', buf.toString());
  });
  worker.on('exit', (code, signal) => {
    win?.webContents.send('wx:exit', { code, signal });
    worker = null;
  });
}

function stopWorker() {
  if (!worker) return;
  // 优雅退出
  worker.stdin.write('exit\n'); // 如果你的 exe 支持；否则直接 kill
  setTimeout(() => {
    try { worker?.kill(); } catch {}
    worker = null;
  }, 500);
}



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// IPC：渲染进程请求启动/停止/发送消息
ipcMain.handle('wx:start', (_e, args: string[] = []) => {
  startWorker(args);
  return { ok: true };
});

ipcMain.handle('wx:stop', () => {
  stopWorker();
  return { ok: true };
});

ipcMain.handle('wx:send', (_e, payload: string) => {
  if (!worker) return { ok: false, error: 'not_running' };
  worker.stdin.write(payload + '\n');
  return { ok: true };
});

ipcMain.handle('wx:isRunning', () => {
  return { running: !!worker && !worker.killed };
});