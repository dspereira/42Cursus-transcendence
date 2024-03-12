from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, "chat/index.html")

def create_chatroom(request):
	return render(request, "chat/create_chatroom.html")

def delete_chatroom(request):
	return render(request, "chat/delete_chatroom.html")

def list_chatroom(request):
	return render(request, "chat/list_chatroom.html")

def join_chatroom(request):
	return render(request, "chat/join_chatroom.html")

def chatroom(request, room_id):
	print("Room ID: ", room_id)
	return render(request, "chat/chatroom.html")
