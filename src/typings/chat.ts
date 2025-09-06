export interface ChatMsg {
    sender: string
    content: string
    timestamp?: string
    isOwn?: boolean
}