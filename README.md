![Instant Games](/images/instantgames.png)

# Facebook Instant Games
Facebook Instant Games extension for the [Defold](https://www.defold.com) game engine.

# Setup
## 1. Add project dependencies
You can use the extension in your own project by adding this project as a [Defold library dependency](http://www.defold.com/manuals/libraries/). Open your game.project file and in the dependencies field under project add:

https://github.com/defold/extension-fbinstant/archive/master.zip

Or point to the ZIP file of a [specific release](https://github.com/defold/extension-fbinstant/releases).

## 2. Preparing index.html

Configure your `game.project` HTML5 section according to the [manual](https://defold.com/manuals/html5/).

### 2.1 Report loading progress
Facebook Instant Games can show the progress while the game is loaded. It is quite easy to set this up for a Defold game. All that is required is to override the Progress.updateProgress() function and pass along the value to the Instant Games API (this is done for you [in the default index.html](https://github.com/defold/extension-fbinstant/blob/master/fbinstant/index.html#L68-L71) provided with this extension):

```
	// Set up a progress listener and feed progress to FBInstant
	Progress.updateProgress = function (percentage, text) {
		FBInstant.setLoadingProgress(percentage);
	}
```

### 2.2 Early API initialization
It has been observed that the progress updates do not work properly on Android. The progress stays at 0 and immediately jumps to 100 when the game has finished loaded. This seems to be caused by the Instant Games API not being initialized until after the game has loaded. In order to avoid this it is recommended to initialize the Instant Games API and flag this to the extension (this is done for you [in the default index.html](https://github.com/defold/extension-fbinstant/blob/master/fbinstant/index.html#L73-L79) provided with this extension):

```Lua
    // Do early initialization of FBInstant
    // This is required to be able to properly update the loading
    // progress above.
    FBInstant.initializeAsync().then(function() {
        // This will be checked by the FBInstant Defold extension
		Module._fbinstant_inited = true;
	});
```

## 3. Create a Facebook App
You also need to create a Facebook App where Instant Games is enabled. Please refer to the [Getting Started documentation](https://developers.facebook.com/docs/games/instant-games/getting-started) on the Instant Games page for further instructions.

## 4. Create a Bundle Configuration file (optional)
You can include an `fbapp-config.json` configuration file in the application bundle that you publish. The file is put in the root directory of your bundle to specify settings for your application. These settings will apply to all users who the bundle is served to. This enables you to launch different bundles along with different application settings to different audiences. Read more about the format [here](https://developers.facebook.com/docs/games/instant-games/sdk/bundle-config).

Defold can automatically include this file in the HTML5 bundle using the [Bundle Resources setting](https://www.defold.com/manuals/project-settings/#_project) in `game.project`. Create a folder in your project to hold the configuration file:

`/my_bundle_resources/web/fbapp-config.json`

And set `my_bundle_resources` as the value in the Bundle Resources field in `game.project`.

# Usage

## FBInstant API
The extension wraps the Instant Games Javascript API in a Lua interface. The API is designed to wrap [version 6.2 of the Instant Games API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.2).

### From promises to callbacks
The async API functions are [Promise based](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in Javascript while the Lua counterparts are callback based.

## Missing API functions
The Facebook Instant Games platform is still evolving and new APIs are added by Facebook quite frequently. This means that there's likely parts of the API that isn't yet provided by this extension. Refer to the [GitHub Issues tagged "Missing API"](https://github.com/defold/extension-fbinstant/issues?q=is%3Aissue+is%3Aopen+label%3A%22missing+api%22) for a list of know missing APIs.

## Facebook Instant Games and LiveUpdate
The [LiveUpdate functionality of Defold](https://www.defold.com/manuals/live-update/) can be combined with Facebook Instant Games to create really small application bundles where additional content can be downloaded while the player is progressing through game. Combine the excluded content with the application bundle in a single zip file when [uploading to the web hosting provided by Facebook Instant Games](https://developers.facebook.com/docs/games/instant-games/test-publish-share#upload). When loading the excluded content you're required to load the content from the same base URL as the rest of the game is loaded from. There is a helper module that will get the base URL from the browser:

```Lua
	local baseurl = require "fbinstant.baseurl"

	local missing_resources = collectionproxy.missing_resources("#level3")
	for _,resource in ipairs(missing_resources) do
		local id = http.request(baseurl.get() .. resource, "GET", callback)
	end
```

# FBInstant API reference

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


### fbinstant.switch_game(app_id, data, callback)
Request that the client switch to a different Instant Game. The API will reject if the switch fails - else, the client will load the new game

**PARAMETERS**
* ```app_id``` (string) - The Application ID of the Instant Game to switch to.
* ```data``` (string) - Optional JSON encoded object containing entrypoint data for the game being switched to.
* ```callback``` (function) - Function to call if the switch fails

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.update(data, callback)
Update the game session.

**PARAMETERS**
* ```data``` (string) - JSON encoded object containing game information (refer to the [CustomUpdatePayload object of the Javascript API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.0#customupdatepayload))
* ```callback``` (function) - Function to call when the value has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.on_pause(callback)
Set a callback to be fired when a pause event is triggered.

**PARAMETERS**
* ```callback``` (function) - Function to call when the game has started

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference


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


### fbinstant.get_signed_player_info(payload, callback)
Fetch the player's unique identifier along with a signature that verifies that the identifier indeed comes from Facebook without being tampered with.

**PARAMETERS**
* ```payload``` (string) - A developer-specified payload to include in the signed response.
* ```callback``` (function) - Function to call with the list of connected players

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```signature``` (string) - A signature to verify this object indeed comes from Facebook.


### fbinstant.get_connected_players(callback)
Get a list of players that are connected to the current player.

**PARAMETERS**
* ```callback``` (function) - Function to call with the list of connected players

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```players``` (string) - JSON encoded array of connected player information

Each entry in the ```players``` array represents a player with these properties:

* ```id``` (string) - Id of the connected player
* ```photo``` (string) - The player's public profile photo
* ```name``` (string) - The player's full name


### fbinstant.get_player_data(keys, callback)
Retrieve data from the designated cloud storage of the current player.

**PARAMETERS**
* ```keys``` (string) - An array of unique keys to retrieve data for.
* ```callback``` (function) - Function to call when the data has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```data``` (string) - JSON encoded key-value pair map containing the requested data.


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


### fbinstant.get_player_stats([stats,] callback)
Retrieve stats from the designated cloud storage of the current player.

**PARAMETERS**
* ```stats``` (string) - Optional JSON encoded array of unique keys to retrieve stats for. If the function is called without it, it will fetch all stats.
* ```callback``` (function) - Function to call when the stat has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```stats``` (string) - JSON encoded key-value pair map containing the requested stats.


### fbinstant.set_player_stats(stats, callback)
Set stats to be saved to the designated cloud storage of the current player.

**PARAMETERS**
* ```stats``` (string) - JSON encoded key-value pairs containing player stats
* ```callback``` (function) - Function to call when the stat have been saved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.increment_player_stats(increments, callback)
Increment stats saved in the designated cloud storage of the current player.

**PARAMETERS**
* ```increments``` (string) - JSON encoded key-value pairs indicating how much to increment each stat.
* ```callback``` (function) - Function to call when the stats have been increased

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```stats``` (string) - JSON encoded key-value pairs with the incremented stats


### fbinstant.can_subscribe_bot(callback)

Returns whether or not the player is eligible to subscribe to the associated chat bot.

**PARAMETERS**
* ```callback``` (function) - Function to call if player can be subscribed to bot

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.subscribe_bot(callback)
Prompts the player to subscribe to the chat bot. Player will only be able to see this bot subscription dialog once for a specific game.

**PARAMETERS**
* ```callback``` (function) - Function to call to decide what to do if the player was subscribed or not

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


## Context functions

### fbinstant.get_context()
Get the current context.

**RETURN**
* ```id``` (string) - The context id, or nil if none exists
* ```type``` (string) - The context type, or nil if none exists (see fbinstant.CONTEXT_* constants)


### fbinstant.choose_context([options,] callback)
Opens a context selection dialog for the player.

**PARAMETERS**
* ```options``` (string|nil) - OPTIONAL! JSON encoded object containing options (refer to the documentation for chooseAsync)
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


### fbinstant.get_entry_point(callback)
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


### fbinstant.get_players(callback)
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


### fbinstant.post_session_score(score)
Posts the player's best score for the session to Facebook.

**PARAMETERS**
* ```score``` (number) - An integer value representing the player's best score in a session.


### fbinstant.get_players()
Get the players in the current context.


## Platform functions

### fbinstant.get_platform()
Gets the active platform the game is running on.

**RETURN**
* ```platform``` (string) - The current platform one of "IOS" or "ANDROID" or "WEB" or "MOBILE_WEB".


### fbinstant.get_locale()
The current locale. See https://origincache.facebook.com/developers/resources/?id=FacebookLocales.xml for a complete list of supported locale values. Use this to determine what languages the current game should be localized with. The value will not be accurate until FBInstant.startGameAsync() resolves.

**RETURN**
* ```locale``` (string) - The locale


### fbinstant.get_supported_apis()
Gets a list of supported apis by the current platform.

Check this list before attempting to use features which don't yet work on all platforms such as ads. Refer to the SDK documentation for a complete list of APIs:
https://developers.facebook.com/docs/games/instant-games/sdk

**RETURN**
* ```apis``` (string) - JSON encoded string with a key value mapping of supported APIs.

**EXAMPLE**
```
local apis_json = fbinstant.get_supported_apis()
local apis = json.decode(apis_json)
if apis["getInterstitialAdAsync"] then
    -- load/show interstitial
end
```

### fbinstant.get_sdk_version()
Gets the current SDK version. Can be used as a sanity check.

**RETURN**
* ```version``` (string) - Example "6.1"


### fbinstant.can_create_shortcut(callback)

Returns whether or not the user is eligible to have shortcut creation requested.

Will return false if createShortcutAsync was already called this session or the user is ineligible for shortcut creation.

Currently only a feature on Android for adding a shortcut to the home screen.

**PARAMETERS**
* ```callback``` (function) - Function to call if shortcut can be created

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not


### fbinstant.create_shortcut(callback)
Prompts the user to create a shortcut to the game if they are eligible to. For now, only for adding a shortcut to the Android home screen. Can only be called once per session.

**PARAMETERS**
* ```callback``` (function) - Function to call to decide what to do if a shortcut was or wasn't created (such as storing data to ask again sometime in the future)

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not



## Share functions

### fbinstant.share()
Invoke a share dialog.

**PARAMETERS**
* ```payload``` (string) - JSON encoded share payload (refer to the [SharePayload object](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.0#sharepayload) from the Javascript API)
* ```callback``` (function) - Function to call when the share dialog has been closed.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not




## Analytics functions

### fbinstant.log_event(event_name, value_to_sum, parameters)
Log an app event with FB Analytics.

**PARAMETERS**
* ```event_name``` (string) - Name of the event (refer to the [Javascript API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.0) for event name limitations)
* ```value_to_sum``` (number) - An numeric value that FB Analytics can calculate a sum with.
* ```parameters``` (string) - JSON encoded object of key value pairs (refer to the [Javascript API](https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.0) for parameter limitations)




## Ads functions

Displaying an ad is a three step process:

1. Creating an ad instance for a placement (using a placement id)
2. Preloading the ad instance (using the ad id returned from #1)
3. Showing the ad instance (using the ad id returned from #1)

### fbinstant.get_interstitial_ad(placement, callback)
Get an interstitial ad instance.

**PARAMETERS**
* ```placement``` (string) - The placement ID that's been setup in your Audience Network settings
* ```callback``` (function) - Function to call when the interstitial ad has been created

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```ad_id``` (string) - Id of the ad instance
* ```error``` (string) - Error code if something went wrong


### fbinstant.load_interstitial_ad(ad_id, callback)
Preload an interstitial ad.

**PARAMETERS**
* ```ad_id``` (string) - Id of the ad instance to preload
* ```callback``` (function) - Function to call when the interstitial ad has loaded

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not
* ```error``` (string) - Error code if something went wrong


### fbinstant.show_interstitial_ad(ad_id, callback)
Present an interstitial ad.

**PARAMETERS**
* ```ad_id``` (string) - Id of the ad instance to show
* ```callback``` (function) - Function to call when user finished watching the ad

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not
* ```error``` (string) - Error code if something went wrong


### fbinstant.get_rewarded_video(placement, callback)
Get a rewarded video instance.

**PARAMETERS**
* ```placement``` (string) - The placement ID that's been setup in your Audience Network settings
* ```callback``` (function) - Function to call when the rewarded video has loaded

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```ad_id``` (boolean) - Id of the crated ad instance
* ```error``` (string) - Error code if something went wrong


### fbinstant.load_rewarded_video(ad_id, callback)
Preload a rewarded video.

**PARAMETERS**
* ```ad_id``` (string) - Id of the ad instance to preload
* ```callback``` (function) - Function to call when the rewarded video has loaded

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not
* ```error``` (string) - Error code if something went wrong


### fbinstant.show_rewarded_video(ad_id, callback)
Present the rewarded video.

**PARAMETERS**
* ```placement``` (string) - Id of the ad instance to show
* ```callback``` (function) - Function to call when user finished watching the ad

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Indicating if the operation was successful or not
* ```error``` (string) - Error code if something went wrong



## Leaderboard functions

### fbinstant.get_leaderboard(name, callback)
Get information about a leaderboard.

**PARAMETERS**
* ```name``` (string) - Name of the leaderboard to get
* ```callback``` (function) - Function to call with leaderboard information

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```context_id``` (string) - The ID of the context that the leaderboard is associated with, or nil if the leaderboard is not tied to a particular context
* ```entry_count``` (number) - The total number of player entries in the leaderboard

### fbinstant.set_leaderboard_score(name, score, extra_data, callback)
Updates the player's score. If the player has an existing score, the old score will only be replaced if the new score is better than it. NOTE: If the leaderboard is associated with a specific context, the game must be in that context to set a score for the player.

**PARAMETERS**
* ```name``` (string) - Name of the leaderboard to set score in
* ```score``` (number) - The new score for the player. Must be a 64-bit integer number.
* ```extra_data``` (string|nil) - Metadata to associate with the stored score. Must be less than 2KB in size.
* ```callback``` (function) - Function to call when the score has been set

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```score``` (number) - The current score for the player
* ```extra_data``` (string) - Metadata to associate with the stored score

### fbinstant.get_leaderboard_score(name, callback)
Retrieves the leaderboard's entry for the current player.

**PARAMETERS**
* ```name``` (string) - Name of the leaderboard to get score from
* ```callback``` (function) - Function to call when the score has been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```rank``` (number) - The current rank of the player
* ```score``` (number) - The current score for the player
* ```extra_data``` (string) - Metadata to associate with the stored score

### fbinstant.get_leaderboard_entries(name, count, offset, callback)
Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.

**PARAMETERS**
* ```name``` (string) - Name of the leaderboard to get entries from
* ```count``` (number) - The number of entries to attempt to fetch from the leaderboard
* ```offset``` (number) - The offset from the top of the leaderboard that entries will be fetched from
* ```callback``` (function) - Function to call when the entries have been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```entries``` (string) - JSON encoded table of entries

Each entry in ```entries``` contains:

* ```rank``` (number) - The rank of the player's score in the leaderboard
* ```score``` (number) - The score associated with the entry
* ```formatted_score``` (string) - The score associated with the entry, formatted with the score format associated with the leaderboard
* ```timestamp``` (number) - The timestamp of when the leaderboard entry was last updated
* ```extra_data``` (string) - The developer-specified payload associated with the score
* ```player_name``` (string) - The player's localized display name
* ```player_photo``` (string) - The url to the player's public profile photo
* ```player_id``` (number) - The game's unique identifier for the player

### fbinstant.get_leaderboard_connected_player_entries(name, count, offset, callback)
Retrieves the leaderboard score entries of the current player's connected players (including the current player), ordered by local rank within the set of connected players.

**PARAMETERS**
* ```name``` (string) - Name of the leaderboard to get entries from
* ```count``` (number) - The number of entries to attempt to fetch from the leaderboard
* ```offset``` (number) - The offset from the top of the leaderboard that entries will be fetched from
* ```callback``` (function) - Function to call when the entries have been retrieved

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```entries``` (string) - JSON encoded table of entries

Each entry in ```entries``` contains:

* ```rank``` (number) - The rank of the player's score in the leaderboard
* ```score``` (number) - The score associated with the entry
* ```formatted_score``` (string) - The score associated with the entry, formatted with the score format associated with the leaderboard
* ```timestamp``` (number) - The timestamp of when the leaderboard entry was last updated
* ```extra_data``` (string) - The developer-specified payload associated with the score
* ```player_name``` (string) - The player's localized display name
* ```player_photo``` (string) - The url to the player's public profile photo
* ```player_id``` (number) - The game's unique identifier for the player



## Payment functions

### fbinstant.on_payments_ready(callback)
Sets a callback to be triggered when Payments operations are available.

**PARAMETERS**
* ```callback``` (function) - Function to call when Payments operations are available

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference

### fbinstant.get_product_catalog(callback)
Fetches the game's product catalog.

**PARAMETERS**
* ```callback``` (function) - Function to call with the set of products that are registered to the game

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```products``` (table) - The products

Each entry in ```products``` contains:

* ```title``` (string) - The title of the product
* ```product_id``` (string) - The product's game-specified identifier
* ```description``` (string) - The product description
* ```image_uri``` (string) - A link to the product's associated image
* ```price``` (string) - The price of the product
* ```price_currency_code``` (string) - The currency code for the product

### fbinstant.get_purchases(callback)
Fetches all of the player's unconsumed purchases. As a best practice, the game should fetch the current player's purchases as soon as the client indicates that it is ready to perform payments-related operations. The game can then process and consume any purchases that are waiting to be consumed.

**PARAMETERS**
* ```callback``` (function) - Function to call with the set of purchases that the player has made for the game

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```purchases``` (table) - The set of purchases that the player has made for the game

Each entry in ```purchases``` contains:

* ```developer_payload``` (string) - A developer-specified string, provided during the purchase of the product
* ```payment_id``` (string) - The identifier for the purchase transaction
* ```product_id``` (string) - The identifier of the purchased product
* ```purchase_time``` (string) - Unix timestamp of when the purchase occurred
* ```purchase_token``` (string) - A token representing the purchase that may be used to consume the purchase
* ```signed_request``` (string) - Server-signed encoding of the purchase request

### fbinstant.purchase(product_id, developer_payload, callback)
Begins the purchase flow for a specific product. Will fail if called before FBInstant.startGameAsync() has finished.

**PARAMETERS**
* ```product_id``` (string) - The identifier of the product to purchase
* ```developer_payload``` (string) - n optional developer-specified payload, to be included in the returned purchase's signed request
* ```callback``` (function) - Function to call when the product is successfully purchased by the player.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```purchase``` (table) - Information about the purchase, same data as an entry returned from `fbinstant.get_purchases()`

### fbinstant.consume_purchase(purchase_token, callback)
Consumes a specific purchase belonging to the current player. Before provisioning a product's effects to the player, the game should request the consumption of the purchased product. Once the purchase is successfully consumed, the game should immediately provide the player with the effects of their purchase.

**PARAMETERS**
* ```purchase_token``` (string) - The purchase token of the purchase that should be consumed
* ```callback``` (function) - Function to call when the purchase has been consumed successfully.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```success``` (boolean) - Boolean indicating if the purchase was successfully consumed or not



## Matchmaking

### fbinstant.check_can_player_match_async(callback)
Checks if the current player is eligible for the matchPlayerAsync API.

**PARAMETERS**
* ```callback``` (function) - Function to call when the check has completed

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```can_match``` (boolean) - true if the player is eligible to match with other players and false otherwise
* ```error``` (string) - Error code if something went wrong

### fbinstant.match_player(match_tag, switch_context_when_matched, offline_match, callback)
Attempts to match the current player with other users looking for people to play with.

**PARAMETERS**
* ```match_tag``` (string) - Optional extra information about the player used to group them with similar players
* ```switch_context_when_matched``` (boolean) - Optional extra parameter that specifies whether the player should be immediately switched to the new context when a match is found
* ```offline_match``` (boolean) - Optional extra parameter that specifies whether to start a match asynchronously.
* ```callback``` (function) - Function to call when the player has been added to a group thread and switched into the thread's context.

The ```callback``` function is expected to accept the following values:

* ```self``` (userdata) - Script self reference
* ```error``` (string) - Error code if something went wrong



## Constants

### Context
#### fbinstant.CONTEXT_SOLO
fbinstant.get_context().type

#### fbinstant.CONTEXT_POST
fbinstant.get_context().type

#### fbinstant.CONTEXT_THREAD
fbinstant.get_context().type

#### fbinstant.CONTEXT_GROUP
fbinstant.get_context().type


### Share
#### fbinstant.SHARE_INTENT_INVITE
For fbinstant.share() payload table

#### fbinstant.SHARE_INTENT_REQUEST
For fbinstant.share() payload table

#### fbinstant.SHARE_INTENT_CHALLENGE
For fbinstant.share() payload table

#### fbinstant.SHARE_INTENT_SHARE
For fbinstant.share() payload table


### Filter
#### fbinstant.FILTER_NEW_CONTEXT_ONLY
For fbinstant.choose_context() options table

#### fbinstant.FILTER_INCLUDE_EXISTING_CHALLENGES
For fbinstant.choose_context() options table

#### fbinstant.FILTER_NEW_PLAYERS_ONLY
For fbinstant.choose_context() options table


### Activity Store
#### fbinstant.STORE_ACTIVE
For fbinstant.get_stores() activity store status

#### fbinstant.STORE_ENDED
For fbinstant.get_stores() activity store status


### Error Codes
#### fbinstant.ERROR_ADS_FREQUENT_LOAD
#### fbinstant.ERROR_ADS_NO_FILL
#### fbinstant.ERROR_ADS_NOT_LOADED
#### fbinstant.ERROR_ADS_TOO_MANY_INSTANCES
#### fbinstant.ERROR_RATE_LIMITED
#### fbinstant.ERROR_INVALID_PARAM
#### fbinstant.ERROR_ANALYTICS_POST_EXCEPTION
#### fbinstant.ERROR_CLIENT_REQUIRES_UPDATE
#### fbinstant.ERROR_CLIENT_UNSUPPORTED_OPERATION
#### fbinstant.ERROR_INVALID_OPERATION
#### fbinstant.ERROR_LEADERBOARD_NOT_FOUND
#### fbinstant.ERROR_LEADERBOARD_WRONG_CONTEXT
#### fbinstant.ERROR_NETWORK_FAILURE
#### fbinstant.ERROR_PAYMENTS_NOT_INITIALIZED
#### fbinstant.ERROR_PENDING_REQUEST
#### fbinstant.ERROR_SAME_CONTEXT
#### fbinstant.ERROR_UNKNOWN
#### fbinstant.ERROR_USER_INPUT


# Tic Tac Toe example
The original Tic Tac Toe example made in Phaser has been recreated in Defold to show how the API is supposed to be user. Refer to the [tictactoe folder](https://github.com/defold/extension-fbinstant/tree/master/tictactoe) for the example.

The example has support for two different backends:

1. Activity Store - This stores the game state using the Facebook Instant Games Activity Store API (2018-04-16: activity stores are currently disabled). Change `game.gui_script` so that it requires `tictactoe.game.data.activity_store` to use this solution.
2. Node.js server - This stores the game state in a simple Node.js backend and a Postgres database. This is what the official Facebook Instant Games Tic Tac Toe example uses. The server code, created by a Facebook engineer, is located in the `tictactoe-server` folder. It's quite easy to get the server up an running on Heroku. Change `game.gui_script` so that it requires `tictactoe.game.data.heroku` to use this solution.
