<template>
  <div class="h-[calc(100vh-100px)] flex flex-col">
    <!-- 预设建议按钮 -->
    <div class="flex gap-2 flex-wrap mb-3">
      <button class="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200" @click="usePreset('topic')">切换话题</button>
      <button class="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200" @click="usePreset('praise')">夸赞</button>
      <button class="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200" @click="usePreset('comfort')">安慰</button>
    </div>

    <!-- 聊天框（建议产出） -->
    <div class="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-lg space-y-2 scroll-slim">
      <div v-for="(m, i) in suggestions" :key="i" class="flex justify-end">
        <ChatBubble :own="true" sender="建议" :content="m" />
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="mt-3 flex items-center gap-2">
      <input v-model="custom" type="text" placeholder="可自定义补充一句..."
             class="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"/>
      <button class="px-3 py-2 rounded-md bg-green-500 text-white hover:opacity-90" @click="appendCustom">加入</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatBubble from '../ChatBubble.vue'

const presets = {
  topic: [
    '我们换个轻松点的话题？比如最近想去的地方。',
    '聊聊今天遇到的一个有趣的小事？',
  ],
  praise: [
    '你这件事处理得很周到，我挺佩服的。',
    '你的想法很有启发，听你说我心情都变好了。',
  ],
  comfort: [
    '先抱抱你，辛苦啦，不用把自己逼太紧。',
    '我在，慢慢来，我们一起想办法。',
  ],
}

const suggestions = ref<string[]>([
  '（这里会根据 AI 分析自动生成建议，示例展示预设内容）'
])
const custom = ref('')

function usePreset(key: keyof typeof presets) {
  suggestions.value.push(...presets[key])
}
function appendCustom() {
  if (!custom.value.trim()) return
  suggestions.value.push(custom.value.trim())
  custom.value = ''
}
</script>