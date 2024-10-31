# DATABASE

Our application uses a **PostgreSQL** database to store user data, game information, tournament results and chat intofmation.

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'></iframe>

## Table of Contents
1. [User](#user)
2. [Friends](#friends)
3. [Live Chat](#live-chat)
4. [Games](#games)
5. [Tournaments](#tournaments)

## Tables

There are a few main tables to consider in our application.

### User

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'> </iframe>

When it comes to user-related data, we have a couple of main tables:

- **auth_user**: Responsible for storing main user login information, such as username, password (hashed), email, last login, and whether the user has verified their email.
- **blacklisted_tokens**: Responsible for storing all expired access and refresh tokens.
- **user_profile_info**: Stores all user profile information, including biography, profile image, online status, and various stats related to games and tournaments.
- **user_settings**: Stores information related to customization options, such as game theme and accessibility settings, including application language.
- **two_factor_user_config**: Stores the cryptographically secured secret key and all two-factor authentication settings, such as whether QR code is enabled, the email, and the phone number. It also includes information to prevent the user from sending multiple codes repeatedly.
- **two_factor_auth_otpcodes**: Stores all 2FA codes to prevent their reuse in future logins.


### Friends

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'> </iframe>

These tables are used to store all friend-related information, including:

- **friend_list**: Stores information about whether two users are friends, their block status, and their last chat interaction.
- **friend_request**: Responsible for storing all user friend requests.

### Live Chat

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'> </iframe>

Our application features a real-time chat system, and these are the tables responsible for it:

- **live_chat_chatroom**: Stores all live chat chatrooms.
- **live_chat_message**: Stores all messages from the chatrooms.

### Games

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'> </iframe>

These are the tables responsible for storing game information:

- **game_gamerequests**: Stores all game request information, including the sender, receiver, expiration time, and status.
- **game_games**: Responsible for storing all game information, such as participants, scores, winner, creation time, played time, status, and whether it is part of a tournament.

### Tournaments

<iframe width="560" height="315" src='https://dbdiagram.io/e/67238e8cb1b39dd85815854e/67238e9ab1b39dd85815872f'> </iframe>

These tables are responsible for storing tournament information:

- **tournament_tournament**: Responsible for storing all tournaments and their information, such as name, number of participants, maximum number of participants, status, and owner.
- **tournament_tournamentplayers**: Stores the information of tournament participants.
- **tournament_tournamentrequests**: Stores all tournament requests.
