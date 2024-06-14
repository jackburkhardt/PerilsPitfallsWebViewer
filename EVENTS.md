## `enter`
Emitted when the client is ready to start a game session. Fetches all relevant data needed to restore game state.

### Arguments
{ \
    `email`: user email (string) \
    `game_id`: perils game ID (string) \
    `token`: user authentication token (string) \
}

### Response
{\
    `state`: game state information (object) \
    `last_played`: timestamp indicating when this state was created (string)\
}

## `gameEvent`
Emitted when an event of note occurs in game. Examples include player decisions and quests, points recieved, traveling, starting/ending conversations.

### Arguments
{ \
    `EventType`: what happened (`conversation_decision`, `points`, `quest_state_change`, etc) (string) \
    `Source`: where this event was emitted in-game (string) \
    `Target`: who/where this event is affecting (string) \
    `LocalTimeStamp`: user's time when the event was triggered (string) \
    `Data`: auxillary data for an event (object) \
    `Duration`: the amount of in-game time this event "took" (integer) \
}
### Response
None

## `putGameState`
Emitted when the game reaches an "auto-save" point. Currently, this is for every time dialogue appears but could be modified to be after every decision.

### Arguments
{ \
    `state`: game state information (object) \
    `last_played`: local timestamp indicating when this state was created (string) \
}

### Response
None