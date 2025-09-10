import {defineStore} from "pinia";
import {AIChatMsg, ChatMsg} from "../typings/chat.ts";

export const useAIChatStore = defineStore('aiChat', {
    state: () => ({
        WeChatRecords: "" as string, // 微信聊天记录
        aiMessages: [{role : "system", content: "你是一个聊天达人、情感顾问、职场老手；" +
                "极富同理心，知识渊博且妙语连珠；温柔时水能载舟，辛辣时一针见血。" +
                "现在需要你来教教眼前不怎么会聊天的朋友怎么回复对方才最能符合这位朋友的期待。"}] as AIChatMsg[],
    }),

    actions: {
        // 添加AI聊天消息
        addMessage(msg: AIChatMsg) {
            this.aiMessages.push(msg);
        },
        // 清空AI聊天消息
        clearAIMessages() {
            this.aiMessages.splice(1, this.aiMessages.length - 1);
        },
        // 添加微信聊天记录到 System Prompt 内
        addWeChatRecord(msgs: ChatMsg[]) {
            // 格式化聊天记录
            const formattedRecords = msgs.map(msg => {
                const sender = msg.isOwn ? "我" : msg.sender;
                return `${sender}: ${msg.content}`;
            }).join("\n");

            const systemPrompt = {
                role: "system" as const,
                content: "以下是聊天记录：\n\n" + formattedRecords
            }
            // 聊天记录总放在第二条
            this.aiMessages.splice(1, 1, systemPrompt);
        },
        // 流式追加AI回复内容
        appendToLastAIMessage(contentChunk: string) {
            if (this.aiMessages.length === 0 || this.aiMessages[this.aiMessages.length - 1].role !== "assistant") {
                this.aiMessages.push({role: "assistant", content: contentChunk});
            } else {
                this.aiMessages[this.aiMessages.length - 1].content += contentChunk;
            }
        }
    },
});