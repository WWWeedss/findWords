import { defineStore } from 'pinia'
import type { ChatMsg } from '../typings/chat'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [
            { sender: '我', content: '到家了吗？', isOwn: true, curContact: '聊天同步区' },
            { sender: '顾秋炎', content: '刚到，准备做饭~', isOwn: false, curContact: '聊天同步区' },
            { sender: '我', content: '晚点视频？', isOwn: true, curContact: '聊天同步区' },
        ] as ChatMsg[],
        curContact: '聊天同步区', // 当前聊天对象
    }),

    actions: {
        // 添加新消息
        addMessage(msg: ChatMsg) {
            this.messages.push(msg)
            this.curContact = msg.curContact
        },

        // 批量添加消息（性能优化）
        addMessages(msgs: ChatMsg[]) {
            this.messages.push(...msgs)
            if (msgs.length > 0) {
                this.curContact = msgs[msgs.length - 1].curContact
            }
        },

        // 清空消息
        clearMessages() {
            this.messages = []
        },

        // 替换所有消息（原子操作）
        setMessages(msgs: ChatMsg[]) {
            this.messages = msgs
            this.curContact = msgs.length > 0 ? msgs[msgs.length - 1].curContact : '聊天同步区'
        },
    },
})
