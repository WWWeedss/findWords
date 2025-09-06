<template>
  <div class="h-[calc(100vh-100px)] flex flex-col">
    <div class="text-sm text-gray-500 mb-2">氛围量表（近 30 分钟）</div>
    <div class="flex-1 bg-white rounded-lg border border-gray-200 p-3 overflow-hidden">
      <Chart type="line" :data="data" :options="options" style="height: 100%; width: 100%" />
    </div>
    <div class="mt-2 text-xs text-gray-500">• AI 将定时更新该量表（示例每 3 秒随机刷新一次）。</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

const labels = Array.from({ length: 10 }).map((_, i) => `${i*3}m`)
const data = ref({
  labels,
  datasets: [
    { label: '积极度', data: labels.map(() => 50 + Math.round(Math.random()*30 - 15)) },
    { label: '紧张度', data: labels.map(() => 40 + Math.round(Math.random()*30 - 15)) },
  ],
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: { y: { min: 0, max: 100 } }
})

onMounted(() => {
  setInterval(() => {
    data.value = {
      labels,
      datasets: [
        { label: '积极度', data: labels.map(() => 50 + Math.round(Math.random()*30 - 15)) },
        { label: '紧张度', data: labels.map(() => 40 + Math.round(Math.random()*30 - 15)) },
      ],
    }
  }, 3000)
})
</script>