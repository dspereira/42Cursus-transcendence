from django.http import HttpResponse, JsonResponse
import json
from .game_logic.game_logic import update_game

def	player_controls(request) :
	print("hello world inside django")
	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	response = update_game(data)
	print("good bye django")
	if (data.get("ball") == 1):
		response_data = {"message": "response has been sent",
					"ball_x": response.ball.x,
					"ball_y": response.ball.y,
				}
	else:
		response_data = {"message": "response has been sent",
						"left_coords" :  response.leftPaddle.y,
						"right_coords" : response.rightPaddle.y,
						"ball_x": response.ball.x,
						"ball_y": response.ball.y,
					}
	return JsonResponse(response_data)
	
# def	send_ball(request) :
# 	print("hello world inside django")
# 	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
# 	response = update_game(data)
# 	print("good bye django")
# 	response_data = {"message": "response has been sent",
# 					"ball_x": response.ball.x,
# 					"ball_y": response.ball.y,
# 				}
# 	return JsonResponse(response_data)

# Create your views here. // routing

# backend e api, corresponde tudo a um request feito pelo frontend (js etc) | answer: json 

# urls.py = rotas q da sort a path => view

# FORMAT RULE ==> routes = /api/[nome da aplicacao]

# transcendence/transcendence

# in transcendence/transcendence/settings.py por o nome da nova aplicacao under "installed_apps"


#tasks: 

"""
	Definitions:
		API: api is defined in views *yes, this file* which is the file in charge of answering every request made from the frontend


	Not_to_forget:
		frontend on 8080
		backend on 8000

	How_to:
		make http request(js): identify the event use fetch(url, request's params); (for http request) 
		Answer from API: appName/urls -> appName/views -> return(JSON SHENANIGANS).
		verify if data was received on frontend and treat the data with some water



	To-Do:
		criar duas aplicacoes:
			-backend => API
			-frontend => JS que faz pedidos a API (http) 
		Frontend:
			-EventListener for keys that send request to API
			-APi calculates shenanigans and sends it back to the frontend through a json 'object'
		^ HARDEST ^
		
		FrontEnd:
			always update the frontend w the new coordinates of the objects on screen!
	TASKS:
		Make basic API that has 1 racket that moves up and down
	
"""