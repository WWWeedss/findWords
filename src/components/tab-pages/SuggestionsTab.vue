<template>
  <div class="h-[calc(100vh-100px)] flex flex-col">
    <!-- 聊天框 -->
    <div class="overflow-y-auto scroll-slim bg-gray-50">
      <div class="flex-1 p-3 rounded-lg space-y-2 h-[74vh]">
        <div v-for="(msg, index) in aiChatMegs" :key="index" class="w-full flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div
              class="max-w-[70%] px-3 py-2 rounded-lg text-sm leading-relaxed break-words whitespace-pre-wrap"
              :class="msg.role === 'user'
            ? 'bg-blue-200 text-black rounded-br-sm'
            : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'"
          >
            {{ msg.content }}
          </div>
        </div>
      </div>
    </div>


    <!-- 底部消息发送栏 -->
    <div class="mt-3 flex items-center gap-2">
       <Textarea
           v-model="custom"
           placeholder="说说看你想怎么回……"
           class="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-300 resize-none scroll-slim"
           @keydown="handleKeydown"
           rows="1"
           @input="autoResize"
       ></Textarea>
      <button class="px-3 py-2 rounded-md bg-green-500 text-white hover:opacity-90 cursor-pointer" @click="appendCustom">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref} from 'vue'
import {AIChatMsg} from "../../typings/chat.ts";
import Textarea from 'primevue/textarea';


const aiChatMegs = ref<AIChatMsg[]>([]);
const custom = ref('')

// 处理键盘按键
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    // 如果按的是 Enter 且没有按 Shift，则发送消息
    event.preventDefault(); // 阻止默认换行行为
    appendCustom(event);
  }
}

function appendCustom(event?: Event) {
  if (!custom.value.trim()) return
  aiChatMegs.value.push({
    role: 'user',
    content: custom.value.trim()
  })
  custom.value = '';
  autoResize(event);
}

// 调整 textarea 高度
function autoResize(event?: Event) {
  nextTick(() => {
    const textarea = event?.target as HTMLTextAreaElement;
    if (textarea) {
      // 设置最大高度为 150px
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  });
}
</script>