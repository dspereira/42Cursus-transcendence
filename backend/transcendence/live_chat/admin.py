from django.contrib import admin
from live_chat.models import ChatRoom, Message, ChatRoomUsers

admin.site.register(ChatRoom)
admin.site.register(Message)
admin.site.register(ChatRoomUsers)
