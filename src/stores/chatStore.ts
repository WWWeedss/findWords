import { reactive } from 'vue'
import type { ChatMsg } from '../typings/chat'

export const chatState = reactive({
    syncing: false,
    messages: [
        { sender: '我', content: '到家了吗？', isOwn: true },
        { sender: '顾秋炎', content: '刚到，准备做饭~', isOwn: false },
        { sender: '我', content: '晚点视频？', isOwn: true },
    ] as ChatMsg[],
})

export function addMessage(msg: ChatMsg) {
    chatState.messages.push(msg)
}