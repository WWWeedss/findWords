<template>
  <div class="h-full flex flex-col">
    <!-- 顶栏 -->
    <div class="p-3 border-gray-200 flex items-center justify-between border-b">
      <div class="font-bold">{{chatState.curContact}}</div>
      <button
          class="px-3 py-1 rounded-md bg-green-500 text-white hover:opacity-90 cursor-pointer hover:bg-green-600"
          @click="onSyncClick"
      >{{ buttonValue }}
      </button>
    </div>

    <!-- 聊天滚动区 -->
    <div ref="scrollRef" class="overflow-y-auto scroll-slim bg-gray-50">
      <div class="flex-1 p-3 space-y-2 h-[85vh]">
        <div v-for="(message, index) in chatState.messages" :key="index" class="w-full flex" :class="message.isOwn ? 'justify-end' : 'justify-start'">
          <div
              class="max-w-[70%] px-3 py-2 rounded-lg text-sm leading-relaxed break-words"
              :class="message.isOwn
              ? 'bg-[#95ec69] text-black rounded-br-sm'
              : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'"
          >
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- 说明 -->
    <div class="text-xs text-gray-500 p-3 border-t border-gray-200">
      • 同步后新消息将自动更新，请直接在取出的窗口中聊天哦。
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import { useChatStore } from '../stores/chatStore'
import {sleep} from "../../common/asyncTools.ts";
import {ChatMsg} from "../typings/chat.ts";

const buttonValue = ref('同步聊天记录')
const chatState = useChatStore()
let error:string[] = [];
onMounted(() => {
  // 监听微信监听器发送的消息
  window.wx.onData((d) => {
    if (d.includes("sender") && d.includes("content")) {
      try {
        const messages = processOutput(d);
        chatState.addMessages(messages);
      } catch (e) {
        console.error("处理消息失败：", d, e);
      }
    }
  });
  window.wx.onError((d) => error.push(`${d}`));
})

function processOutput(output: string): ChatMsg[] {
  const messages: ChatMsg[] = [];
  const lines = output.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.startsWith('{') && line.endsWith('}'));

  for (const line of lines) {
    try {
      const msg = processSingleOutput(line);
      messages.push(msg);
    } catch (e) {
      console.warn("解析消息失败，跳过:", line);
    }
  }

  return messages;
}

function processSingleOutput(output: string): ChatMsg {
  const jsonObject = JSON.parse(output);

  // 添加验证
  if (!jsonObject.sender || !jsonObject.content || typeof jsonObject.isOwn !== 'boolean') {
    throw new Error('无效的消息格式');
  }

  return {
    sender: String(jsonObject.sender),
    content: String(jsonObject.content),
    curContact: String(jsonObject.curContact),
    isOwn: Boolean(jsonObject.isOwn)
  };
}


const scrollRef = ref<HTMLDivElement | null>(null);
let isRunning = false;
async function onSyncClick() {
  // 清理状态
  isRunning = await window.wx.isRunning();
  chatState.clearMessages();
  error = []

  if (!isRunning) {
    buttonValue.value = '启动监听程序中...'
    // 第一次同步，启动微信监听器
    await window.wx.start();
    // 检查 error.value 处理报错

    await sleep(1500) // 等待一会儿，让错误信息有机会进来
    if (error.length > 0) {
      console.error("微信监听器启动失败：", error);
      alert("微信监听器启动失败，请检查是否打开微信客户端！");
      return
    }
    isRunning = true;
    // 启动成功
    console.log("微信监听器已启动")
  }
  buttonValue.value = '正在同步...'
  // 标记同步；实际 Electron 可：window.api.startSync()
  // 监听微信消息
  await window.wx.send("refresh");

  await sleep(100)
  if (error.length > 0) {
    console.error("微信监听器同步失败：", error);
    alert("未检索到聊天窗口，请先打开目标聊天窗口！");
    buttonValue.value = '同步聊天记录'
    return
  }

  // 等待处理 output
  await sleep(3000)

  console.log("最终消息:", chatState.messages);
  buttonValue.value = '同步聊天记录'
}

function scrollToBottom() {
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

onMounted(scrollToBottom)

watch(() => chatState.messages.length, scrollToBottom)
</script>