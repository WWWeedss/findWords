import { defineStore } from 'pinia'
import type { ChatMsg } from '../typings/chat'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [
            { sender: '我', content: '到家了吗？', isOwn: true },
            { sender: '顾秋炎', content: '刚到，准备做饭~', isOwn: false },
            { sender: '我', content: '晚点视频？', isOwn: true },
        ] as ChatMsg[],
    }),

    actions: {
        // 添加新消息
        addMessage(msg: ChatMsg) {
            this.messages.push(msg)
        },

        // 批量添加消息（性能优化）
        addMessages(msgs: ChatMsg[]) {
            this.messages.push(...msgs)
        },

        // 清空消息
        clearMessages() {
            this.messages = []
        },

        // 替换所有消息（原子操作）
        setMessages(msgs: ChatMsg[]) {
            this.messages = msgs
        },
    },
})
