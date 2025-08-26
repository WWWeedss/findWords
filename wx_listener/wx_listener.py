import json

from wxauto import WeChat   # 开源版

class Message:
    def __init__(self, sender, content):
        self.sender = sender
        self.content = content

    def to_dict(self):
        return {
            'sender': self.sender,
            'content': self.content,
        }

    def to_json(self):
        return json.dumps(self.to_dict(), ensure_ascii=False)

# 初始化微信实例
wx = WeChat()

# 获取号主昵称
nickname = wx.core.nickname
# 获取当前窗口联系人
cur_contact_person = wx.core.chatbox.get_info().get('chat_name')
# 获取当前聊天窗口对象
chat = wx.GetSubWindow(nickname=cur_contact_person)

# 将 msg 消息打印出来，包含发送者和内容
def print_message_in_json(msg):
    sender = msg.sender if msg.sender != 'self' else nickname
    content = msg.content
    message_info = Message(sender, content)
    print(message_info.to_json())

# 获取并打印当前聊天窗口信息
msgs = wx.GetAllMessage()
for message in msgs:
    if message.type == 'text':
        print_message_in_json(message)


# 监听消息的回调函数
def on_message(msg, chat):
    if msg.type != 'text':
        return
    print_message_in_json(msg)

wx.AddListenChat(nickname=cur_contact_person,
                 callback=on_message)
# 保持监听
wx.KeepRunning()