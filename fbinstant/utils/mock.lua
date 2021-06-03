if fbinstant then return end
fbinstant = {
	mock = true
}

local function get_save_path(name)
	local application_id = sys.get_config("project.title"):gsub(" ", "_")
	return sys.get_save_file(application_id, "fbinstant_" .. name)
end

local function save(name, data)
	assert(name, "You must provide a filename")
	assert(data and type(data) == "table", "You must provide a table to save")
	return sys.save(get_save_path(name), data)
end

local function load(name)
	assert(name, "You must provide a filename")
	return sys.load(get_save_path(name))
end


local rxijson = require "fbinstant.utils.json"


fbinstant.mock = true

fbinstant.CONTEXT_SOLO = "SOLO"
fbinstant.CONTEXT_POST = "POST"
fbinstant.CONTEXT_THREAD = "THREAD"
fbinstant.CONTEXT_GROUP = "GROUP"

fbinstant.SHARE_INTENT_INVITE = "INVITE"
fbinstant.SHARE_INTENT_REQUEST = "REQUEST"
fbinstant.SHARE_INTENT_CHALLENGE = "CHALLENGE"
fbinstant.SHARE_INTENT_SHARE = "SHARE"

fbinstant.FILTER_NEW_CONTEXT_ONLY = "NEW_CONTEXT_ONLY"
fbinstant.FILTER_INCLUDE_EXISTING_CHALLENGES = "INCLUDE_EXISTING_CHALLENGES"
fbinstant.FILTER_NEW_PLAYERS_ONL = "NEW_PLAYERS_ONLY"

fbinstant.ERROR_INVALID_PARAM = "INVALID_PARAM"
fbinstant.ERROR_ADS_FREQUENT_LOAD = "ADS_FREQUENT_LOAD"
fbinstant.ERROR_ADS_NO_FILL = "ADS_NO_FILL"
fbinstant.ERROR_ADS_NOT_LOADED = "ADS_NOT_LOADED"
fbinstant.ERROR_ADS_TOO_MANY_INSTANCES = "ADS_TOO_MANY_INSTANCES"
fbinstant.ERROR_RATE_LIMITED = "RATE_LIMITED"
fbinstant.ERROR_INVALID_PARAM = "INVALID_PARAM"
fbinstant.ERROR_ANALYTICS_POST_EXCEPTION = "ANALYTICS_POST_EXCEPTION"
fbinstant.ERROR_CLIENT_REQUIRES_UPDATE = "CLIENT_REQUIRES_UPDATE"
fbinstant.ERROR_CLIENT_UNSUPPORTED_OPERATION = "CLIENT_UNSUPPORTED_OPERATION"
fbinstant.ERROR_INVALID_OPERATION = "INVALID_OPERATION"
fbinstant.ERROR_LEADERBOARD_NOT_FOUND = "LEADERBOARD_NOT_FOUND"
fbinstant.ERROR_LEADERBOARD_WRONG_CONTEXT = "LEADERBOARD_WRONG_CONTEXT"
fbinstant.ERROR_NETWORK_FAILURE = "NETWORK_FAILURE"
fbinstant.ERROR_PAYMENTS_NOT_INITIALIZED = "PAYMENTS_NOT_INITIALIZED"
fbinstant.ERROR_PENDING_REQUEST = "PENDING_REQUEST"
fbinstant.ERROR_SAME_CONTEXT = "SAME_CONTEXT"
fbinstant.ERROR_UNKNOWN = "UNKNOWN"
fbinstant.ERROR_USER_INPUT = "USER_INPUT"

local player_data = {}

local session_data = {}

local player_stats = {}

local leaderboards = {}

local purchases = {}

fbinstant.ENTRY_POINT_DATA = {}
fbinstant.PLAYER = {}
fbinstant.PLAYERS = {}
fbinstant.CONNECTED_PLAYERS = {}
fbinstant.CONTEXT = nil
fbinstant.LEADERBOARDS = {}
fbinstant.PRODUCTS = {}

local function get_self()
	return _G[3700146495]
end
--------------------------------
--------------- LIFECYCLE
--------------------------------

function fbinstant.initialize(cb)
	print("initialize")
	cb(get_self(), true)
end

function fbinstant.set_loading_progress()
	print("set_loading_progress")
end

function fbinstant.start_game(cb)
	print("start_game")
	cb(get_self(), true)
end

function fbinstant.switch_game(app_id, data, cb)
	print("switch_game", app_id, data)
	cb(get_self(), true)
end

function fbinstant.update(jsondata, cb)
	print("update", jsondata)
	cb(get_self(), true)
end

function fbinstant.quit()
	print("quit")
	os.exit()
end

function fbinstant.on_pause(cb)
	print("on_pause")
end


--------------------------------
--------------- MISC FUNCTIONS
--------------------------------

function fbinstant.log_event(event_name, value_to_sum, params)
	print("log_event", event_name, value_to_sum, params)
end

function fbinstant.share(payload, cb)
	print("share")
	pprint(rxijson.decode(payload))
	cb(get_self(), true)
end

function fbinstant.get_platform()
	print("get_platform")
	return "WEB"
end

function fbinstant.get_locale()
	print("get_locale")
	return sys.get_sys_info().device_language
end

function fbinstant.get_supported_apis()
	print("get_supported_apis")
	return rxijson.encode({
		["getLocale"] = true,
		["getPlatform"] = true,
		["getSupportedAPIs"] = true,
		["getEntryPointData"] = true,
		["logEvent"] = true,
		["onPause"] = true,
		["initializeAsync"] = true,
		["setLoadingProgress"] = true,
		["setSessionData"] = true,
		["startGameAsync"] = true,
		["shareAsync"] = true,
		["switchGameAsync"] = true,
		["quit"] = true,
		["getEntryPointAsync"] = true,
		["updateAsync"] = true,
		["getSDKVersion"] = true,

		["player.getID"] = true,
		["player.getName"] = true,
		["player.getPhoto"] = true,
		["player.flushDataAsync"] = true,
		["player.getDataAsync"] = true,
		["player.setDataAsync"] = true,
		["player.getStatsAsync"] = true,
		["player.setStatsAsync"] = true,
		["player.incrementStatsAsync"] = true,
		["player.getSignedPlayerInfoAsync"] = true,
		["player.getConnectedPlayersAsync"] = true,
		["player.subscribeBotAsync"] = true,
		["player.canSubscribeBotAsync"] = true,

		["context.getID"] = true,
		["context.getType"] = true,
		["context.isSizeBetween"] = true,
		["context.switchAsync"] = true,
		["context.chooseAsync"] = true,
		["context.createAsync"] = true,
		["context.getPlayersAsync"] = true,

		--["payments.onReady"] = true,
		--["matchPlayerAsync"] = true,

		["getLeaderboardAsync"] = true,
		--["checkCanPlayerMatchAsync"] = true,
	})
end

function fbinstant.get_sdk_version()
	print("get_sdk_version")
	return "6.2"
end


function fbinstant.can_create_shortcut(cb)
	print("can_create_shortcut")
	cb(get_self(), true)
end

function fbinstant.create_shortcut(cb)
	print("create_shortcut")
	cb(get_self(), true)
end


--------------------------------
--------------- SESSION AND ENTRY DATA
--------------------------------

function fbinstant.get_entry_point_data()
	print("get_entry_point_data")
	return rxijson.encode(fbinstant.ENTRY_POINT_DATA)
end

function fbinstant.get_entry_point(cb)
	print("get_entry_point")
	return cb(get_self(), "admin_message")
end

function fbinstant.set_session_data(jsondata)
	print("set_session_data", jsondata)
	session_data = json.decode(jsondata)
end


--------------------------------
--------------- PLAYER FUNCTIONS
--------------------------------

function fbinstant.get_player()
	print("get_player")
	return fbinstant.PLAYER
end

function fbinstant.get_signed_player_info(payload, cb)
	print("get_signed_player_info", payload)
	return cb(get_self(), "AvmB5jEYtr3X6rGyzOj57KJBK6Noz-CsnlCEstbYaSo.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTUyMzYwNDE3NSwicGxheWVyX2lkIjoiMTY0NzMwMDQyODY3Mzg1NyIsInJlcXVlc3RfcGF5bG9hZCI6IjE5NTc3MDU5Njc1ODAzODkifQ")
end

function fbinstant.get_connected_players(cb)
	print("get_connected_players")
	cb(get_self(), rxijson.encode(fbinstant.CONNECTED_PLAYERS))
end

function fbinstant.get_player_data(keys, cb)
	print("get_player_data", keys)
	local result = {}
	for _,key in pairs(json.decode(keys)) do
		result[key] = player_data[key]
	end
	cb(get_self(), rxijson.encode(result))
end

function fbinstant.set_player_data(jsondata, cb)
	print("set_player_data", jsondata)
	player_data = player_data or {}
	for k,v in pairs(json.decode(jsondata)) do
		player_data[k] = v
	end
	cb(get_self(), true)
end

function fbinstant.flush_player_data(cb)
	print("flush_player_data")
	cb(get_self(), true)
end

function fbinstant.get_player_stats(stats, cb)
	print("get_player_stats", stats)
	if type(stats) == "function" then
		cb(get_self(), rxijson.encode(player_stats))
	else
		local result = {}
		for _,key in ipairs(json.decode(stats)) do
			result[key] = player_stats[key]
		end
		cb(get_self(), rxijson.encode(result))
	end
end

function fbinstant.set_player_stats(statsjson, cb)
	print("set_player_stats", statsjson)
	player_stats = json.decode(statsjson)
	cb(get_self(), true)
end

function fbinstant.increment_player_stats(statsjson, cb)
	print("increment_player_stats", statsjson)
	local stats = json.decode(statsjson)
	for k,v in pairs(stats) do
		player_stats[k] = player_stats[k] or 0
		player_stats[k] = player_stats[k] + v
	end
	cb(get_self(), rxijson.encode(player_stats))
end

function fbinstant.can_subscribe_bot(cb)
	print("can_subscribe_bot")
	cb(get_self(), true)
end

function fbinstant.subscribe_bot(cb)
	print("subscribe_bot")
	cb(get_self(), true)
end


--------------------------------
--------------- CONTEXT FUNCTIONS
--------------------------------

function fbinstant.choose_context(options, cb)
	print("choose_context")
	if type(options) == "function" then cb = options end
	cb(get_self(), fbinstant.CONTEXT and fbinstant.CONTEXT.id, fbinstant.CONTEXT and fbinstant.CONTEXT.type)
end

function fbinstant.create_context(player_id, cb)
	print("create_context", player_id)
	cb(get_self(), fbinstant.CONTEXT and fbinstant.CONTEXT.id, fbinstant.CONTEXT and fbinstant.CONTEXT.type)
end

function fbinstant.switch_context(context_id, cb)
	print("switch_context", context_id)
	fbinstant.CONTEXT.id = context_id
	cb(get_self(), fbinstant.CONTEXT and fbinstant.CONTEXT.id, fbinstant.CONTEXT and fbinstant.CONTEXT.type)
end

function fbinstant.get_context()
	return fbinstant.CONTEXT and fbinstant.CONTEXT.id or nil, fbinstant.CONTEXT and fbinstant.CONTEXT.type or nil
end

function fbinstant.is_size_between(min, max)
	print("is_size_between", min, max)
	if not fbinstant.CONTEXT then
		return false
	end
	return fbinstant.CONTEXT.size >= min and fbinstant.CONTEXT.size <= max
end

function fbinstant.get_players(cb)
	print("get_players")
	cb(get_self(), fbinstant.PLAYERS)
end

--------------------------------
--------------- ADS
--------------------------------

local interstitial_ads = {}
local rewarded_videos = {}
local instance_count = 0
local function get_ads(ads, placement)
	ads[placement] = ads[placement] or {}
	return ads[placement]
end
local function find_ad(ads, id)
	for placement,instances in pairs(ads) do
		for _,ad in pairs(instances) do
			if ad.id == id then
				return ad
			end
		end
	end
end
local function insert_ad(ads, ad)
	ads[#ads + 1] = ad
end
local function remove_ad(ads, id)
	for i,ad in pairs(ads) do
		if ad.id == id then
			table.remove(ads, i)
			break
		end
	end
end

function fbinstant.get_interstitial_ad(placement, cb)
	print("get_interstitial_ad", placement)
	local ads = get_ads(interstitial_ads, placement)
	if #ads == 3 then
		cb(get_self(), nil, fbinstant.ERROR_ADS_TOO_MANY_INSTANCES)
	else
		instance_count = instance_count + 1
		local ad = {
			placement = placement,
			id = tostring(instance_count),
			loaded = false,
		}
		insert_ad(ads, ad)
		cb(get_self(), ad.id)
	end
end
function fbinstant.load_interstitial_ad(id, cb)
	print("load_interstitial_ad", id)
	local ad = find_ad(interstitial_ads, id)
	if not ad then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	elseif ad.loaded then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	else
		ad.loaded = true
		cb(get_self(), true)
	end
end
function fbinstant.show_interstitial_ad(id, cb)
	print("show_interstitial_ad", id)
	local ad = find_ad(interstitial_ads, id)
	if not ad then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	elseif not ad.loaded then
		cb(get_self(), false, fbinstant.ERROR_ADS_NOT_LOADED)
	else
		remove_ad(get_ads(interstitial_ads, ad.placement), ad.id)
		cb(get_self(), true)
	end
end


function fbinstant.get_rewarded_video(placement, cb)
	print("get_rewarded_video", placement)
	local ads = get_ads(rewarded_videos, placement)
	if #ads == 3 then
		cb(get_self(), nil, fbinstant.ERROR_ADS_TOO_MANY_INSTANCES)
	else
		instance_count = instance_count + 1
		local ad = {
			placement = placement,
			id = tostring(instance_count),
			loaded = false,
		}
		insert_ad(ads, ad)
		cb(get_self(), ad.id)
	end
end
function fbinstant.load_rewarded_video(id, cb)
	print("load_rewarded_video", id)
	local ad = find_ad(rewarded_videos, id)
	if not ad then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	elseif ad.loaded then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	else
		ad.loaded = true
		cb(get_self(), true)
	end
end
function fbinstant.show_rewarded_video(id, cb)
	print("show_rewarded_video", id)
	local ad = find_ad(rewarded_videos, id)
	if not ad then
		cb(get_self(), false, fbinstant.ERROR_INVALID_PARAM)
	elseif not ad.loaded then
		cb(get_self(), false, fbinstant.ERROR_ADS_NOT_LOADED)
	else
		remove_ad(get_ads(rewarded_videos, ad.placement), ad.id)
		cb(get_self(), true)
	end
end


--------------------------------
--------------- LEADERBOARD
--------------------------------
local function get_leaderboard(name)
	local leaderboard = fbinstant.LEADERBOARDS[name]
	if not leaderboard then
		return nil
	end
	if leaderboard.contextual then
		leaderboard.entries = leaderboard.entries or {}
		leaderboard.entries[fbinstant.CONTEXT.id] = leaderboard.entries[fbinstant.CONTEXT.id] or {}
		return leaderboard.entries[fbinstant.CONTEXT.id]
	else
		leaderboard.entries = leaderboard.entries or {}
		return leaderboard.entries
	end
end

local function find_leaderboard_entry(leaderboard, id)
	for i,entry in ipairs(leaderboard) do
		if entry.player_id == fbinstant.PLAYER.id then
			return entry, i
		end
	end
	return nil
end

function fbinstant.get_leaderboard(name, cb)
	print("get_leaderboard", name)
	local leaderboard = get_leaderboard(name)
	if not leaderboard then
		cb(get_self())
		return
	end
	cb(get_self(), "1234", #leaderboard)
end

function fbinstant.set_leaderboard_score(name, score, extra_data, cb)
	print("set_leaderboard_score", name, score, extra_data)
	local leaderboard = get_leaderboard(name)
	if not leaderboard then
		cb(get_self())
		return
	end

	local entry = find_leaderboard_entry(leaderboard, fbinstant.PLAYER.id)
	if not entry then
		entry = { score = -1 }
		table.insert(leaderboard, entry)
	end
	if score > entry.score then
		entry.score = score
		entry.formatted_score = tostring(score)
		entry.extra_data = extra_data
		entry.timestamp = os.time()
		entry.player_name = fbinstant.PLAYER.name
		entry.player_photo = fbinstant.PLAYER.photo
		entry.player_id = fbinstant.PLAYER.id
	end
	table.sort(leaderboard, function(a, b)
		return a.score < b.score
	end)
	cb(get_self(), entry.score, entry.extra_data)
end

function fbinstant.get_leaderboard_score(name, cb)
	print("get_leaderboard_score")
	local leaderboard = get_leaderboard(name)
	if not leaderboard then
		cb(get_self())
		return
	end

	local entry, rank = find_leaderboard_entry(leaderboard, fbinstant.PLAYER.id)
	if not entry then
		cb(get_self())
	else
		cb(get_self(), rank, entry.score, entry.extra_data)
	end
end

function fbinstant.get_leaderboard_entries(name, count, offset, cb)
	print("get_leaderboard_score", name, count, offset)
	local leaderboard = get_leaderboard(name)
	if not leaderboard then
		cb(get_self())
		return
	end

	local entries = {}
	for i=1,count do
		local entry = leaderboard[i + offset]
		if not entry then
			break
		end
		entries[#entries + 1] = entry
	end

	cb(get_self(), rxijson.encode(entries))
end

--------------------------------
--------------- IAP
--------------------------------

local function get_product(product_id)
	for _,product in pairs(fbinstant.PRODUCTS) do
		if product.product_id == product_id then
			return product
		end
	end
	return nil
end

function fbinstant.on_payments_ready(callback)
	print("on_payments_ready")
	callback(get_self())
end

function fbinstant.get_product_catalog(callback)
	print("get_product_catalog")
	callback(get_self(), rxijson.encode(fbinstant.PRODUCTS))
end

function fbinstant.get_purchases(callback)
	print("get_purchases")
	callback(get_self(), rxijson.encode(purchases))
end

function fbinstant.purchase(product_id, developer_payload, callback)
	print("purchase", product_id, developer_payload)
	local product = get_product(product_id)
	if not product then
		callback(get_self(), nil)
		return
	end
	local purchase = {
		developer_payload = developer_payload,
		payment_id = "paymentid" .. (socket.gettime() + math.random()),
		product_id = product_id,
		purchase_time = os.time(),
		purchase_token = "token" .. (socket.gettime() + math.random()),
		signed_request = "signed_request"
	}
	purchases[#purchases + 1] = purchase
	callback(get_self(), rxijson.encode(purchase))
end


function fbinstant.consume_purchase(purchase_token, callback)
	print("consume_purchase", purchase_token)
	for i,purchase in pairs(purchases) do
		if purchase.purchase_token == purchase_token then
			table.remove(purchases, i)
			callback(get_self(), true)
		end
	end
	callback(get_self(), false)
end

--------------------------------
--------------- SESSION SCORE
--------------------------------

function fbinstant.post_session_score(score)
	print("post_session_score", score)
end


--------------------------------
--------------- MATCHMAKING
--------------------------------

function fbinstant.match_player(match_tag, switch_context_when_matched, offline_match, callback)
	print("match_player", match_tag, switch_context_when_matched, offline_match)
	callback(get_self(), nil)
end

function fbinstant.check_can_player_match_async(callback)
	print("check_can_player_match_async")
	callback(get_self(), true)
end

