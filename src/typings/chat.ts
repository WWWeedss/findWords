export interface ChatMsg {
    sender: string
    content: string
    curContact: string
    isOwn?: boolean
}

export interface AIChatMsg {
    role: 'user' | 'assistant' | 'system'
    content: string
}