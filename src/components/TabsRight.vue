<template>
       <Tabs value="0">
        <TabList>
          <Tab value="0">聊天建议</Tab>
          <Tab value="1">心理觉察</Tab>
          <Tab value="2">氛围量表</Tab>
        </TabList>
      <TabPanels>
        <TabPanel value="0">
          <SuggestionsTab />
        </TabPanel>
        <TabPanel value="1">
          <AwarenessTab />
        </TabPanel>
        <TabPanel value="2">
          <MoodScaleTab />
        </TabPanel>
      </TabPanels>
     </Tabs>
</template>

<script setup lang="ts">
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import SuggestionsTab from './tab-pages/SuggestionsTab.vue'
import AwarenessTab from './tab-pages/AwarenessTab.vue'
import MoodScaleTab from './tab-pages/MoodScaleTab.vue'
</script>

<style scoped>
/* 你可以根据需要添加一些样式 */
</style>
