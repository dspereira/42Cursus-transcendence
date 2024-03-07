from django.shortcuts import render
from live_chat.models import ChatRoom
from django.http import JsonResponse, HttpResponse
import json

def index(request):
    return render(request, "live_chat/index.html", {
        'rooms': ChatRoom.objects.all(),
    })

def room_view(request, room_name):
    chat_room, created = ChatRoom.objects.get_or_create(name=room_name)
    return render(request, "live_chat/room.html", {
        'room': chat_room,
    })

def apiCreateRoom(request):

    if request.method == "POST" and request.body:
        req_data = json.loads(request.body)
        room_name = req_data['chatroom_name']

        chatroom = ChatRoom.objects.filter(name=room_name).first()
        if chatroom:
            message = f"{room_name} already exists !"
        else:
            chatroom = ChatRoom.objects.create(name=room_name)
            message = f"{room_name} was created with success !"

        response = {"message": message}

    else:
        response = {"message": "Invalid Method or Without Body"}

    return JsonResponse(response)

def apiDeleteRoom(request):

    if request.method == "DELETE" and request.body:
        req_data = json.loads(request.body)
        room_name = req_data['chatroom_name']

        chatroom = ChatRoom.objects.filter(name=room_name).first()
        if chatroom:
            chatroom.delete()
            message = f"{room_name} was deleted with success !"
        else:
            message = f"{room_name} does not exists !"

        response = {"message": message}

    else:
        response = {"message": "Invalid Method or Without Body"}

    return JsonResponse(response)

def apiDeleteRoom(request):

    if request.method == "DELETE":

        chat_rooms = ChatRoom.objects.all()
        
        for room in chat_rooms:
            print("Room Name: ", room.name)
            room.delete()

        message = "All Chat Rooms have benn deleted successfully !"
        response = {"message": message}

    else:
        response = {"message": "Invalid Method or Without Body"}

    return JsonResponse(response)

def apiTest(request):
    print("")
    print("Entrei na Api Test")
    print("")

    return JsonResponse({"message": "Api Test"})
