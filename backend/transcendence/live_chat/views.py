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

def apiDeleteAllRooms(request):

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

import os

def apiListRooms(request):

    if request.method == "GET":

        chat_rooms = ChatRoom.objects.all()
        chat_rooms_count = ChatRoom.objects.count()

        os.system('clear')
        print("---------------------------------")
        print(f"Chat Rooms -> {chat_rooms_count}\nID: Room Name | Online Count")
        print("---------------------------------")
        for room in chat_rooms:
            print(f"{room.id}: {room.name} | {room.get_online_count()}")
        print("---------------------------------")

        list_chatrooms = []

        for room in chat_rooms:
            list_chatrooms.append({"id": room.id, "name": room.name, "online": room.get_online_count()})

        if chat_rooms_count > 0:
            message = "All Chat Rooms have benn listed successfully !"
        else:
            message = "There is no ChatRooms in DataBase !"

        response = {"message": message, "ChatRooms": list_chatrooms}

    else:
        response = {"message": "Invalid Method or Without Body"}

    return JsonResponse(response)

def apiTest(request):
    print("")
    print("Entrei na Api Test")
    print("")

    return JsonResponse({"message": "Api Test"})
