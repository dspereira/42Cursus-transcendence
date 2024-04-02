from django.shortcuts import render
from live_chat.models import ChatRoom, ChatRoomUsers
from user_auth.models import User
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods
import os

from custom_utils.models_utils import ModelManager

chatroom_model = ModelManager(ChatRoom)
chatroom_users_model = ModelManager(ChatRoomUsers)
user_model = ModelManager(User)

@require_http_methods(["POST"])
def apiCreateRoom(request):

	if request.body:
		req_data = json.loads(request.body)
		room_name = str(req_data['chatroom_name']).strip()
		if room_name:
			chatroom = chatroom_model.create(name=room_name)
			if not chatroom:
				message = {"message": f"Error when trying to create chatroom with name: {room_name}"}
			else:
				message_status = f"{chatroom.name} was created with success !"
				info = {
					'message': message_status,
					"room_name": room_name,
					"room_id": chatroom.id
				}
				message = {"message": info}
		else:
			message = {"message": "Room name is Empty"}
	else:
		message = {"message": "Invalid Method or Without Body"}
	return JsonResponse(message)

@require_http_methods(["POST"])
def apiAddUserToChatRoom(request):

	if request.body:
		req_data = json.loads(request.body)
		user_id = req_data['user_id']
		room_id = req_data['room_id']
		if user_id is not None and room_id is not None:
			user = user_model.get(id=user_id)
			room = chatroom_model.get(id=room_id)
			if user is None:
				message = f"User {user_id} is not defined"
			elif room is None:
				message = f"User {room_id} is not defined"
			else:
				if not chatroom_users_model.filter(user=user, room=room):
					chatroom_users_model.create(user=user, room=room)
					message = f"User {user_id} added successfully to chat room {room_id}"
				else:
					message = f"User {user_id} is already registered in chat room {room_id}"
			response = {"message": message}
		else:
			response = {"message": "Empty user_id or room_id"}
	else:
		response = {"message": "Empty request body"}
	return JsonResponse(response)

@require_http_methods(["DELETE"])
def apiDeleteRoom(request):

	if request.body:
		req_data = json.loads(request.body)
		room_name = str(req_data['chatroom_name']).strip()
		chatroom = chatroom_model.filter(name=room_name).first()
		if chatroom:
			chatroom.delete()
			message = f"{room_name} was deleted with success !"
		else:
			message = f"{room_name} does not exists !"
		response = {"message": message}
	else:
		response = {"message": "Invalid Method or Without Body"}
	return JsonResponse(response)

@require_http_methods(["DELETE"])
def apiDeleteAllRooms(request):

	chat_rooms = chatroom_model.all()
	chat_rooms.delete()

	message = "All Chat Rooms have benn deleted successfully !"
	response = {"message": message}
	return JsonResponse(response)

@require_http_methods(["GET"])
def apiListRooms(request):

	chat_rooms = chatroom_model.all()
	chat_rooms_count = chatroom_model.count()
	list_chatrooms = []

	if chat_rooms_count > 0:
		for room in chat_rooms:
			list_chatrooms.append({"id": room.id, "name": room.name, "online": room.get_online_count()})
		message = "All Chat Rooms have benn listed successfully !"
	else:
		message = "There is no ChatRooms in DataBase !"
	response = {"message": message, "ChatRooms": list_chatrooms}
	return JsonResponse(response)

@require_http_methods(["GET"])
def apiGetChatRoom(request):

	query_params = request.GET
	message = None
	status = 200

	if 'room_id' in query_params:
		room_id = query_params.get('room_id')
		if room_id and chatroom_model.filter(id=room_id):
			room = chatroom_model.get(id=room_id)
			room_name = room.name
			message = "200 | Exists"
			response = {"message": message, "status": 200, "exist": True, "room_name": room_name}
		else:
			response = {"message": "401 | Unauthorized", "status": 401}
			status = 401
	else:
		response = {"message": "401 | Unauthorized", "status": 401}
		status = 401
	return JsonResponse(response, status=status)

@require_http_methods(["GET"])
def apiGetUserChatRooms(request):

	query_params = request.GET
	user_id = -1

	if 'user_id' in query_params and query_params.get('user_id'):
		user_id = query_params.get('user_id')
		if user_model.filter(id=user_id):
			user = user_model.get(id=user_id)
			user_chatrooms = chatroom_users_model.filter(user=user)
			if user_chatrooms:
				users_amount_chatrooms = user_chatrooms.count()
				user_chatrooms_json = []
				for chat_room in user_chatrooms:
					append_room = {
						"room_id": chat_room.room.id,
						"room_name": chat_room.room.name
					}
					user_chatrooms_json.append(append_room)
				response = {
					"message": "200 | The user have ChatRooms",
					"status": 200,
					"user_id": user_id,
					"chatrooms_count": users_amount_chatrooms,
					"user_chatrooms": user_chatrooms_json
				}
			else:
				response = {"message": "200 | The user does not have any ChatRooms", "status": 200, "user_id": user_id, "chatrooms_count": 0}
		else:
			response = {"message": "401 | Unauthorized", "status": 401}
	else:
		response = {"message": "401 | Unauthorized", "status": 401}
	return JsonResponse(response, status=response["status"])

def apiCheckUserChatRoomAccess(request):

	query_params = request.GET

	if ('user_id' in query_params and query_params.get('user_id')) and ('room_id' in query_params and query_params.get('room_id')):
		search_user = user_model.get(id=query_params.get('user_id'))
		search_room = chatroom_model.get(id=query_params.get('room_id'))
		if search_user and search_room:
			if chatroom_users_model.filter(user=search_user, room=search_room):
				response = {"message": "200 | OK", "status": 200}
			else:
				response = {"message": "401 | Unauthorized", "status": 401}
		else:
			response = {"message": "401 | Unauthorized", "status": 401}
	else:
		response = {"message": "401 | Unauthorized", "status": 401}
	return JsonResponse(response, status=response["status"])

def apiTest(request):
	print("")
	print("Entrei na Api Test")
	print("")

	return JsonResponse({"message": "Api Test"})
