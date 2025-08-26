<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const logs = ref<string[]>([]);
const running = ref(false);

let offData: (() => void) | null = null;
let offError: (() => void) | null = null;
let offExit: (() => void) | null = null;

async function start() {
  await window.wx.start();
  const s = await window.wx.isRunning();
  running.value = s.running;
}

async function stop() {
  await window.wx.stop();
  const s = await window.wx.isRunning();
  running.value = s.running;
}

async function send() {
  await window.wx.send('hello from renderer');
}

onMounted(async () => {
  offData = window.wx.onData((d) => logs.value.push(`[OUT] ${d}`));
  offError = window.wx.onError((d) => logs.value.push(`[ERR] ${d}`));
  offExit = window.wx.onExit((i) => logs.value.push(`[EXIT] code=${i.code} signal=${i.signal}`));
  running.value = (await window.wx.isRunning()).running;
});

onBeforeUnmount(() => {
  offData?.(); offError?.(); offExit?.();
});
</script>

<template>
  <div class="p-4 space-y-3">
    <div>进程状态：<b>{{ running ? '运行中' : '未运行' }}</b></div>
    <div class="space-x-2">
      <button @click="start">启动</button>
      <button @click="send" :disabled="!running">发送消息</button>
      <button @click="stop" :disabled="!running">停止</button>
    </div>
    <pre class="bg-gray-100 p-2 h-80 overflow-auto">{{ logs.join('') }}</pre>
  </div>
</template>
