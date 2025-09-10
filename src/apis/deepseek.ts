import {AIChatMsg} from "../typings/chat.ts";
import OpenAI from "openai";

let openai: OpenAI | null = null;

// 初始化 OpenAI 客户端
async function initializeOpenAI() {
    if (openai) return openai;
    
    const env = await window.env.get();
    if (!env.DEEPSEEK_KEY) {
        throw new Error('DEEPSEEK_KEY 不存在，请检查 .env 文件');
    }
    
    openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: env.DEEPSEEK_KEY,
        dangerouslyAllowBrowser: true
    });
    
    return openai;
}

export async function getStreamedCompletion(messages: AIChatMsg[])  {
    try {
        const client = await initializeOpenAI();
        return await client.chat.completions.create({
            model: "deepseek-chat",
            messages: messages,
            stream: true,
        });
    } catch (error) {
        console.error("Error in getting streamed completion:", error);
        throw error;
    }
}