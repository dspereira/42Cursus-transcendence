export const ptAppChatDict = {
    /* HTML */
    no_friends_msg: "Nenhum amigo adicionado.",
    find_friends_msg: "Clique aqui para fazer amigos!",
    no_friend_selected: "Nenhum amigo selecionado. Selecione um amigo para começar a conversar.",

	/* stateManager.setState("errorMsg */
	error_msg: "Erro: O utilizador a quem tentou mandar mensagem já não é seu amigo",
}

export const ptAppConfigs = {
    /* HTML */
	profile_settings_header: "Configurações do Perfil",
	new_username_label: "Mudar Nome de Usuário",
	new_username_placeholder: "Novo Nome de Usuário",
	new_bio_label: "Mudar Bio",
	new_bio_placeholder: "Nova Bio",
	security_settings_header: "Configurações de Segurança",
	security_settings_legend: "Escolha onde receber a sua autenticação de dois fatores:",
	show_qrcode: "Mostar QR Code",
	security_phone_label: "Telefone",
	game_settings_header: "Configurações do Jogo",
	game_theme_label: "Escolha o tema do jogo:",
	language_settings_header: "Configurações de Idioma",
	language_label: "Escolha o idioma:",
	apply_changes_button: "Aplicar Alterações",
	upload_image_button: "Enviar Imagem",
	new_avatar_button: "Novo Avatar",
	apply_changes_button: "Aplicar Mudanças",

	/* connectedCallback */
	success: "Configurações do usuário atualizadas com sucesso",
	username_invalid: "Nome de usuário inválido!",
	image_size: "O tamanho da imagem não deve exceder",
	image_type: "Apenas os seguintes formatos são aceitos:",

	/* stateManager.setState("errorMsg */
	error_msg: "Erro: Não foi possivel obter o QRCode",
}

export const ptAppFriendsDict = {
	/* HTML */
	search_button: "Procurar",
	all_friends_button: "Todos os amigos",
	requests_button: "Solicitações",
	search_bar_placeholder_search: "Procurar amigos...",

	/* #createSearchPage() */
	no_users_to_search: "Não há usuários para procurar!",

	/* #createFriendsPage() */
	create_friends_no_friends: "Sua lista de amigos está vazia.",

	/* #createRequestsPage() */
	create_requests_no_requests: "Você não tem pedidos de amizade.",
	
	/* #search(type, value) */
	username_not_found: "Usuário não encontrado!"
}

export const ptAppLobbyDict = {
	/* HTML */
	ready_button: "Pronto",

	/* #updatePlayer(playerInfo, playerType) */
	ready_status: "Pronto",
	not_ready_status: "Não Pronto",
	
	/* stateManager.setState("errorMsg */
	error_msg1: "O jogo já não existe",
	error_msg2: "Todos os jogadores recusarão o seu convite",
}

export const ptAppPlayDict = {
	/* HTML */
	leave_button: "Sair",
}

export const ptChatFriendListDict = {
	/* HTML */
	search_bar_placeholder_search: "Procurar usuários..."
}

export const ptChatSectionDict = {
	/* HTML */
	message_placeholder: "Mensagem...",

	/* #getTimeDate(timestamp) */
	today_timestamp: "Hoje",
	yesterday_timestamp: "Ontem",
}

export const ptGameHistory = {
	/* HTML */
	solo_games_button: "Jogos Solo",
	tournament_games: "Jogos de Torneio",
	victory_color: "Vitória",
	defeat_color: "Derrota",

	/* #insertGames(gameList) */
	no_games_played: "Nenhum jogo jogado ainda.",

	/* #insertTournaments(tournamentList) */
	no_tournaments_played: "Nenhum torneio jogado ainda.",
}

export const ptGameInviteCardDict = {
	/* HTML */
	join_button: "Juntar-se"
}

export const ptGameInviteRequestDict = {
	/* HTML */
	game_invites: "Convites de Jogos",

	/* stateManager.setState("errorMsg */
	error_msg: "Convite expirou",
}

export const ptGameInviteSendDict = {
	/* HTML */
	search_bar_placeholder_search: "Procurar amigos...",
	invite_button: "Convidar",

	/* stateManager.setState("errorMsg */
	error_msg: "Não conseguio convidar",
}

export const ptPageChatDict = {
	title: "BlitzPong - Chat"
}

export const ptPageConfigsDict = {
	title: "BlitzPong - Configurações"
}

export const ptPageFriendsDict = {
	title: "BlitzPong - Amigos"
}

export const ptPageHomeDict = {
	title: "BlitzPong - Início"
}

export const ptPagePlayDict = {
	title: "BlitzPong - Jogar",
	/* HTML */
	invite_button: "Convidar para o Jogo"
}

export const ptPageTournamentInfoDict = {
	title: "BlitzPong - Informação de Torneio",
}

export const ptPageTournamentsDict = {
	title: "BlitzPong - Torneio",
	/* HTML */
	create_tournament_button: "Criar Torneio",
	exit_tournament_button: "Sair do Torneio"
}

export const ptSidePanelDict = {
	/* HTML */
	home: "Início",
	chat: "Chat",
	tournaments: "Torneios",
	friends: "Amigos",
	play: "Jogar",
	logout: "Sair",
	logout_popup_msg: "Sair do BlitzPong",
	logout_popup_close: "Fechar",
	logout_popup_logout: "Sair",
	configurations: "Configurações"
}

export const ptTournamentCardDict = {
	/* HTML */
	see_more_info_button: "Mais Informações",
}

export const ptTourneyGraphDict = {
	/* HTML */
	tournament_winner: "VENCEDOR",
	start_game_button: "Iniciar Jogo",
}

export const ptTourneyInviteCardDict = {
	/* HTML */
	join_button: "Juntar-se"
}

export const ptTourneyInviterDict = {
	/* HTML */
	search_bar_placeholder_search: "Procurar amigos...",
	invite_button: "Convidar",
}

export const ptTourneyInvitesReceivedDict = {
	/* HTML */
	tournaments_invites: "Convites de Torneios"
}

export const ptTourneyLobbyDict = {
	/* getHTML */
	start_button: "Iniciar",
	cancel_button: "Cancelar",
	leave_button: "Sair",
	update_name_button: "Mudar Nome",

	/* #setDefaultPhoto(elmHtml) */
	player_username_placeholder: "aguardando...",

	/* stateManager.setState("errorMsg */
	error_msg1: "Não foi possivel cancelar o torneio",
	error_msg2: "Não foi possivel sair do torneio",
	error_msg3: "Não foi possivel iniciar o torneio",
	error_msg4: "Não foi possivel mudar o nome do torneio",
}

export const ptUserProfile = {
	/* #updateStats(stats) */
	total_games: "Total de Jogos:",
	games_win_rate: "Percentagem de Vitórias:",
	total_tournaments: "Total de Torneios:",
	tournaments_win_rate: "Percentagem de Vitórias de Torneios:",
}

export const ptUserCardDict = {
	/* stateManager.setState("errorMsg */
	error_msg1: "Pedido já foi aceite",
	error_msg2: "Pedido expirou",
	error_msg3: "Já não é amigo do utilizador",
}