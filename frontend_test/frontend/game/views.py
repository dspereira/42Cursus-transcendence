from django.shortcuts import render

def index(request):
	return render(request, "game/index.html")

def game_create(request):
	return render(request, "game/game_create.html")

def game_join(request):
	return render(request, "game/game_join.html")

def	actual_game(request):
	return render(request, "game/game.html")
