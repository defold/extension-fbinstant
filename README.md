# extension-fbinstant
Facebook Instant Games extension for the [Defold](https://www.defold.com) game engine.

# Setup
## Project dependencies
You can use the extension in your own project by adding this project as a [Defold library dependency](http://www.defold.com/manuals/libraries/). Open your game.project file and in the dependencies field under project add:

https://github.com/defold/extension-fbinstant/archive/master.zip

Or point to the ZIP file of a [specific release](https://github.com/defold/extension-fbinstant/releases).

## Preparing index.html
Before the extension can be used you need to add the Facebook Instant Games API to the index.html of your game. [Refer to the index.html in the root of this project](https://github.com/defold/extension-fbinstant/blob/master/index.html#L56) for an example of this.

## Creating a Facebook App
You also need to create a Facebook App where Instant Games is enabled. Please refer to the [Getting Started documentation](https://developers.facebook.com/docs/games/instant-games/getting-started) on the Instant Games page for further instructions.

# Usage
## FBInstant API
The extension wraps the Instant Games Javascript API in a Lua interface. The API is designed to wrap [version 6.0 of the Instant Games API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.0).

### From promises to callbacks
The async API functions are [Promise based](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in Javascript while the Lua counterparts are callback based.

## Missing API functions
Some parts of the Instant Games Javascript API hasn't yet been wrapped in a Lua interface:

* FBinstant.getInterstitialAdAsync
* FBinstant.getRewardedVideoAsync
* FBInstant.player.getConnectedPlayersAsync
* FBInstant.getLeaderboardAsync()

## Lifecycle functions

### fbinstant.initialize(callback)
Initialize the Facebook Instant Games SDK.

**PARAMETERS**
* ```callback``` (function) - Function to call when the SDK is initialized

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.start_game(callback)
Indicate that the game is ready to start.

**PARAMETERS**
* ```callback``` (function) - Function to call when the game has started

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.update(data, callback)
Update the game session.

**PARAMETERS**
* ```data``` (string) - JSON encoded object containing game information (refer to the [CustomUpdatePayload object of the Javascript API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant5.0#customupdatepayload))
* ```callback``` (function) - Function to call when the value has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.quit()
Quit the current game session.


### fbinstant.set_loading_progress()
Report the game's initial loading progress.

**PARAMETERS**
* ```progress``` (number) - A number between 0 and 100



## Player functions

### fbinstant.get_player()
Get information about the player.

**RETURN**
* ```player``` (table) - Player information

The ```player``` table contains the following key-value pairs:

* ```name``` (string) - Player name
* ```id``` (string) - Player id
* ```photo``` (string) - URL to the player photo
* ```locale``` (string) - Player locale


### fbinstant.get_player_data(key, callback)
Retrieve data from the designated cloud storage of the current player.

**PARAMETERS**
* ```key``` (string) - Key holding the data to get
* ```callback``` (function) - Function to call when the data has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```value``` (string) - The data or nil if it doesn't exist


### fbinstant.set_player_data(data, callback)
Set data to be saved to the designated cloud storage of the current player.

**PARAMETERS**
* ```data``` (string) - JSON encoded key-value pairs containing player data
* ```callback``` (function) - Function to call when the data has been saved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.flush_player_data(callback)
Immediately flushes any changes to the player data to the designated cloud storage.

**PARAMETERS**
* ```callback``` (function) - Function to call when the data has been flushed

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.get_player_stats(key, callback)
Retrieve stats from the designated cloud storage of the current player.

**PARAMETERS**
* ```key``` (string) - Key holding the stat to get
* ```callback``` (function) - Function to call when the stat has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```value``` (string) - The stat or nil if it doesn't exist


### fbinstant.set_player_stats(stats, callback)
Set stats to be saved to the designated cloud storage of the current player.

**PARAMETERS**
* ```stats``` (string) - JSON encoded key-value pairs containing player stats
* ```callback``` (function) - Function to call when the stat have been saved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.increment_player_stats(stats)
Increment stats saved in the designated cloud storage of the current player.

**PARAMETERS**
* ```increments``` (string) - JSON encoded key-value pairs indicating how much to increment each stat.
* ```callback``` (function) - Function to call when the stats have been increased

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```stats``` (string) - JSON encoded key-value pairs with the incremented stats



## Context functions

### fbinstant.get_contect()
Get the current context.

**RETURN**
* ```id``` (string) - The context id, or nil if none exists
* ```type``` (string) - The context type, or nil if none exists (see fbinstant.CONTEXT_* constants)


### fbinstant.choose_context([options], callback)
Opens a context selection dialog for the player.

**PARAMETERS**
* ```options``` (string) - OPTIONAL! JSON encoded object containing options (refer to the documentation for chooseAsync)
* ```callback``` (function) - Function to call when a context has been selected. It is now possible to call get_context() to get the context.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```id``` (string) - The context id, or nil if none exists
* ```type``` (string) - The context type, or nil if none exists (see fbinstant.CONTEXT_* constants)


### fbinstant.create_context(player_id, callback)
Attempts to create or switch into a context between a specified player and the current player.

**PARAMETERS**
* ```player_id``` (string) - ID of the player
* ```callback``` (function) - Function to call when the context has been created

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```id``` (string) - The context id, or nil if none exists
* ```type``` (string) - The context type, or nil if none exists (see fbinstant.CONTEXT_* constants)


### fbinstant.switch_context(context_id, callback)
Request a switch into a specific context.

**PARAMETERS**
* ```context_id``` (string) - ID of the context
* ```callback``` (function) - Function to call when when the switch has been made

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```id``` (string) - The context id, or nil if none exists
* ```type``` (string) - The context type, or nil if none exists (see fbinstant.CONTEXT_* constants)


### fbinstant.get_entry_point_data()
Get entry point data.

**RETURN**
* ```data``` (string) - The entry point data as a JSON string


### fbinstant.get_entry_point()
Get the entry point that the game was launched from.

**PARAMETERS**
* ```callback``` (function) - Function to call when the entry point has been received.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```entry_point``` (string) - The entry point


### fbinstant.set_session_data(data)
Set data associated with the session.

**PARAMETERS**
* ```data``` (string) - JSON encoded object containing session data


### fbinstant.get_players()
Get the players in the current context.

**PARAMETERS**
* ```callback``` (function) - Function to call when the players have been received.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```players``` (table) - Table with players in the context

Each entry in the ```players``` table has the following values:

* ```id``` (string) - User id
* ```name``` (string) - User name
* ```photo``` (string) - URL to a photo of the user




## Share functions

### fbinstant.share()
Invoke a share dialog.

**PARAMETERS**
* ```payload``` (string) - JSON encoded share payload (refer to the [SharePayload object](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant5.0#sharepayload) from the Javascript API)
* ```callback``` (function) - Function to call when the share dialog has been closed.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not




## Activity Store functions

### fbinstant.create_store(name, callback)
Create a new activity store associated with the current context.

**PARAMETERS**
* ```name``` (string) - Name of the store to create
* ```callback``` (function) - Function to call when the store has been created

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```store_id``` (string) - Id of the created activity store


### fbinstant.close_store(name, callback)
Close an activity store associated with the current context.

**PARAMETERS**
* ```name``` (string) - Name of the store to close
* ```callback``` (function) - Function to call when the store has been closed

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.get_store_data(store_name, keys, callback)
Get data from an activity store in the current context.

**PARAMETERS**
* ```store_name``` (string) - Name of the store to get data from
* ```keys``` (string) - JSON encoded array of keys to stored values
* ```callback``` (function) - Function to call when the values have been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```data``` (string) - JSON encoded key-value pairs with the retrieved values


### fbinstant.get_stores(callback)
Get all activity stores in the current context.

**PARAMETERS**
* ```callback``` (function) - Function to call when the stores have been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```stores``` (string) - JSON encoded array of activity stores

Each entry in ```stores``` contains the following values:

* ```id``` (string) - Store id
* ```name``` (string) - Store name
* ```status``` (string) - Store status (STORE_*)
* ```context_id``` (string) - Id of the context the store belongs to


### fbinstant.save_store_data(store_name, data, callback)
Save data to an activity store in the current context.

**PARAMETERS**
* ```store_name``` (string) - Name of the store to save data to
* ```data``` (string) - JSON encoded array of key-value pairs (note limitations on key and value length in official documentation).
* ```callback``` (function) - Function to call when the data has been saved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.increment_store_data(store_name, data, callback)
Increment the data of an activity store in the current context.

**PARAMETERS**
* ```store_name``` (string) - Name of the store to increment data in
* ```data``` (string) - JSON encoded array of key-value pairs
* ```callback``` (function) - Function to call when the data has been saved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```data``` (string) - JSON encoded table with the incremented data.



## Constants

### fbinstant.CONTEXT_SOLO
fbinstant.get_contect().type

### fbinstant.CONTEXT_POST
fbinstant.get_contect().type

### fbinstant.CONTEXT_THREAD
fbinstant.get_contect().type

### fbinstant.CONTEXT_GROUP
fbinstant.get_contect().type


### fbinstant.SHARE_INTENT_INVITE
For fbinstant.share() payload table

### fbinstant.SHARE_INTENT_REQUEST
For fbinstant.share() payload table

### fbinstant.SHARE_INTENT_CHALLENGE
For fbinstant.share() payload table

### fbinstant.SHARE_INTENT_SHARE
For fbinstant.share() payload table


### FILTER_NEW_CONTEXT_ONLY
For fbinstant.choose_context() options table

### FILTER_INCLUDE_EXISTING_CHALLENGES
For fbinstant.choose_context() options table

### FILTER_NEW_PLAYERS_ONLY
For fbinstant.choose_context() options table


### STORE_ACTIVE
For fbinstant.get_stores() activity store status

### STORE_ENDED
For fbinstant.get_stores() activity store status


# Tic Tac Toe example
The original Tic Tac Toe example made in Phaser has been recreated in Defold to show how the API is supposed to be user. Refer to the [tictactoe folder](https://github.com/defold/extension-fbinstant/tree/master/tictactoe) for the example.


# TODO
* Some API functions are missing (see [Missing APIs](#missing-api-functions))
* Some functions expect JSON data as input. These functions should preferably accept Lua tables instead.
