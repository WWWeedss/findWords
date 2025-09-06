import json, sys, signal, atexit
from wxauto import WeChat

wx = WeChat()
nickname = wx.core.nickname
cur_contact_person = None

class Message:
    def __init__(self, sender, content, cur_contact_person):
        self.sender = sender
        self.content = content
        self.cur_contact_person = cur_contact_person
        self.isOwn = (sender == nickname)
    def to_dict(self): return {'sender': self.sender, 'content': self.content,'curContact': self.cur_contact_person, 'isOwn': self.isOwn}
    def to_json(self): return json.dumps(self.to_dict(), ensure_ascii=False)

def print_message_in_json(msg):
    sender = msg.sender if msg.sender != 'self' else nickname
    print(Message(sender, msg.content, cur_contact_person).to_json())

def on_message(msg, chat):
    if msg.type == 'text':
        print_message_in_json(msg)

def main():
    global cur_contact_person
    while True:
        try:
            cmd = input("").strip()
        except (EOFError, KeyboardInterrupt):
            cmd = "exit"

        if not cmd:
            continue

        parts = cmd.split()
        op = parts[0].lower()

        if op == "refresh":
            new_contact_person = wx.core.chatbox.get_info().get('chat_name')
            if new_contact_person is None:
                print("No contactor now!", file=sys.stderr)
                continue

            if cur_contact_person:
                wx.RemoveListenChat(cur_contact_person)
            cur_contact_person = new_contact_person
            for message in wx.GetAllMessage():
                if message.type == 'text':
                    print_message_in_json(message)
            wx.AddListenChat(nickname=cur_contact_person, callback=on_message)

        elif op in ("quit", "exit"):
            break

if __name__ == "__main__":
    main()

