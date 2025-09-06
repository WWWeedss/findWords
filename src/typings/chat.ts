export interface ChatMsg {
    sender: string
    content: string
    curContact: string
    isOwn?: boolean
}