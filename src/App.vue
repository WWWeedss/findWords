<template>
  <div class="bg-white">
    <div class="grid grid-cols-12 h-full">
      <aside class="col-span-6 border-r border-gray-200">
        <ChatList />
      </aside>
      <main class="col-span-6">
        <TabsRight />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatList from './components/ChatList.vue'
import TabsRight from './components/TabsRight.vue'
</script>

<style scoped>
</style>
