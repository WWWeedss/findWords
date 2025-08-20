from wxauto import WeChat   # 开源版

# 初始化微信实例
wx = WeChat()

# 获取当前窗口联系人
cur_contact_person = wx.core.chatbox.get_info().get('chat_name')

# 获取当前聊天窗口对象
chat = wx.GetSubWindow(nickname=cur_contact_person)

def on_message(msg, chat):
    # 记录发送时间
    # 记录消息内容
    print(msg.content)

wx.AddListenChat(nickname=cur_contact_person,
                 callback=on_message)

wx.KeepRunning()