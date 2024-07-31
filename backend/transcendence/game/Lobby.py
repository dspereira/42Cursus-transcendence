class Lobby:
    def __init__(self, host_user_id):
        self.user_1 = host_user_id
        self.user_2 = 0
        self.ready_status_player_1 = False
        self.ready_status_player_2 = False

    def set_user_2_id(self, user_2_id):
        self.user_2 = user_2_id

    def get_user_2_id(self):
        return self.user_2

    def update_ready_status(self, user_id):
        if user_id == self.user_1:
            self.ready_status_player_1 = self.__get_new_ready_status(self.ready_status_player_1)
        else:
            self.ready_status_player_2 = self.__get_new_ready_status(self.ready_status_player_2)

    def is_ready_to_start(self):
        if self.ready_status_player_1 and self.ready_status_player_2:
            return True
        return False

    def __get_new_ready_status(self, current_status):
        new_status = True
        if current_status == True:
            new_status = False
        return new_status

lobby_dict = {}
