import {AIChatMsg} from "../typings/chat.ts";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config({
    path: `../../.env`
});

const deepseekKey = process.env.DEEPSEEK_KEY;
console.log(deepseekKey);
const openai = new OpenAI({
   baseURL: "https://api.deepseek.com",
   apiKey: deepseekKey
});

async function getStreamedCompletion(messages: AIChatMsg[])  {
    try {
        return await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: messages,
            stream: true,
        });
    } catch (error) {
        console.error("Error in getting streamed completion:", error);
    }
}

getStreamedCompletion([{role: "system", content: "You are a helpful assistant."},
    {role: "user", content: "你好？今天天气怎么样？"}]);