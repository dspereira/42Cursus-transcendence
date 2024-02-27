from django.shortcuts import render
from live_chat.models import ChatRoom

def index(request):
    return render(request, "live_chat/index.html", {
        'rooms': ChatRoom.objects.all(),
    })

def room_view(request, room_name):
    chat_room, created = ChatRoom.objects.get_or_create(name=room_name)
    return render(request, "live_chat/room.html", {
        'room': chat_room,
    })
