<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Button from 'primevue/button'

const logs = ref<string[]>([]);
const running = ref(true);

let offData: (() => void) | null = null;
let offError: (() => void) | null = null;
let offExit: (() => void) | null = null;

async function start() {
  await window.wx.start();
  running.value = true;
}

async function stop() {
  await window.wx.stop();
  running.value = false;
}

async function send() {
  logs.value = [];
  await window.wx.send('refresh');
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
      <button @click="send">发送消息</button>
      <button @click="stop">停止</button>
      <Button label="PrimeVue 按钮" />
    </div>
    <pre class="bg-gray-100 p-2 h-80 overflow-auto">{{ logs.join('') }}</pre>
  </div>
</template>
