<template>
  <div class="max-w-full">
    <div class="text-[10px] text-gray-800 mb-1" v-if="!own">{{ sender }}</div>
    <div :class="[
      'bubble', own ? 'wx-own self-end' : 'wx-other', own ? 'rounded-br-sm' : 'rounded-bl-sm'
    ]">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props { own?: boolean; sender?: string; content?: string }
const props = defineProps<Props>()
const own = props.own ?? false
const sender = props.sender ?? '对方'
const content = props.content ?? ''
</script>