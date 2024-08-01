class Lobby:
    def __init__(self, host_user_id):
        self.user_1 = host_user_id
        self.user_2 = 0
        self.ready_status_player_1 = False
        self.ready_status_player_2 = False
        self.user_1_connected = False
        self.user_2_connected = False

    def set_user_2_id(self, user_2_id):
        self.user_2 = user_2_id

    def get_user_2_id(self):
        return self.user_2

    def get_host_id(self):
        return self.user_1

    def update_ready_status(self, user_id):
        if user_id == self.user_1:
            self.ready_status_player_1 = self.__get_new_ready_status(self.ready_status_player_1)
        else:
            self.ready_status_player_2 = self.__get_new_ready_status(self.ready_status_player_2)

    def update_connected_status(self, user_id, status):
        if user_id == self.user_1:
            self.user_1_connected = status
        else:
            self.user_2_connected = status

    def is_ready_to_start(self):
        if self.ready_status_player_1 and self.ready_status_player_2:
            return True
        return False

    def has_access(self, user_id):
        if self.user_1 == user_id or self.user_2 == user_id:
            return True
        return False

    def is_user_connected(self, user_id):
        if user_id == self.user_1:
            return self.user_1_connected
        else:
            return self.user_2_connected

    def is_user_ready(self, user_id):
        if user_id == self.user_1:
            return self.ready_status_player_1
        else:
            return self.ready_status_player_2

    def __get_new_ready_status(self, current_status):
        new_status = True
        if current_status == True:
            new_status = False
        return new_status

    def __str__(self) -> str:
        res = "\n---------------------------------------------------\n"
        res += f"Host User  -> {self.user_1}\n"
        res += f"Other User -> {self.user_2}\n"
        res += f"Host User Connected  -> {self.user_1_connected}\n"
        res += f"Other User Connected -> {self.user_2_connected}\n"
        res += "---------------------------------------------------\n"
        return res

lobby_dict = {}
