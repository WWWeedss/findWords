<template>
  <div class="h-full flex flex-col">
    <!-- 顶栏 -->
    <div class="p-3 border-gray-200 flex items-center justify-between border-b ">
      <div class="font-medium">顾秋炎</div>
      <button
          class="px-3 py-1 rounded-md bg-green-500 text-white hover:opacity-90"
          @click="onSyncClick"
      >同步聊天记录
      </button>
    </div>

    <!-- 聊天滚动区 -->
    <div ref="scrollRef" class="overflow-y-auto scroll-slim">
      <div class="flex-1 p-3 space-y-2 bg-gray-50 h-[85vh]">
        <div v-for="(m, idx) in msgs" :key="idx" class="w-full flex" :class="m.isOwn ? 'justify-end' : 'justify-start'">
          <ChatBubble :own="m.isOwn" :sender="m.sender" :content="m.content"/>
        </div>
      </div>
    </div>

    <!-- 说明 -->
    <div class="text-xs text-gray-500 p-3 border-t border-gray-200">
      • 同步后新消息将自动更新（示例中使用 mock；Electron 中可通过 `window.api` 与主进程交互）。
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {chatState, addMessage} from '../stores/chatStore'
import ChatBubble from './ChatBubble.vue'

const msgs = chatState.messages
const scrollRef = ref<HTMLDivElement | null>(null)

function onSyncClick() {
  // 标记同步；实际 Electron 可：window.api.startSync()
  chatState.syncing = true

  // 演示：模拟后台持续进来消息（真实场景：监听主进程/后端 stdout 行）
  mockIncoming()
}

function mockIncoming() {
  const demo = [
    {sender: '顾秋炎', content: '今天挺累的。'},
    {sender: '我', content: '辛苦啦，要不要点个外卖？', isOwn: true},
    {sender: '顾秋炎', content: '好呀，你选吧~'},
  ]
  let i = 0
  const timer = setInterval(() => {
    if (!chatState.syncing || i >= demo.length) {
      clearInterval(timer);
      return
    }
    addMessage(demo[i++] as any)
  }, 1200)
}

function scrollToBottom() {
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

onMounted(scrollToBottom)
watch(() => chatState.messages.length, scrollToBottom)
</script>