<template>
  <div class="h-[calc(100vh-100px)] flex flex-col">
    <div class="text-sm text-gray-500 mb-2">基于最近聊天的情绪线索与自我觉察提示：</div>

    <div class="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-lg space-y-2 scroll-slim">
      <!-- 示例：以“对方”为主的觉察 -->
      <ChatBubble :own="false" sender="觉察" content="对方表达了疲惫（关键词：累），宜先共情再提建议。"/>
      <ChatBubble :own="false" sender="觉察" content="对方语气轻松（关键词：好呀~），此时适合提出选择题以降低决策成本。"/>
      <ChatBubble :own="false" sender="觉察" content="避免连续追问；用具体、可执行的小建议替代宏大建议。"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatBubble from "../ChatBubble.vue"
</script>