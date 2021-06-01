local rxijson = require "fbinstant.utils.json"
local async = require "tictactoe.utils.async"

local M = {}

local BACKEND_URL = "https://fbinstant-xoxo-defold.herokuapp.com"

local HEADERS = {
	["Content-Type"] = "application/json"
}

local function get_signed_player_info(data)
	return async.async(function(done)
		fbinstant.get_signed_player_info(data or "", function(self, signature)
			done(signature)
		end)
	end)
end

local function ignore_cache(url)
	return url .. "?ignore_cache=" .. os.time()
end

function M.save(data)
	local co = coroutine.running()
	assert(co)
	local context_id, context_type = fbinstant.get_context()
	local signature = get_signed_player_info(rxijson.encode(data))
	local post_data = rxijson.encode({
		contextId = context_id,
		player = fbinstant.get_player().id,
		signature = signature
	})

	local response = async.http_request(ignore_cache(BACKEND_URL .. "/save-match"), "POST", HEADERS, post_data)
	if response.status < 200 or response.status > 399 then
		return false, ("Error when saving data. Status: %d"):format(response.status)
	end

	local decoded_response = nil
	local ok, err = pcall(function()
		decoded_response = json.decode(response.response)
	end)
	if not ok then
		return false, ("Unable to decode response. Err: %s"):format(err)
	end
	if not decoded_response.success then
		return false, ("Request wasn't successful. Err: %s"):format(decoded_response.error)
	end
	return true
end

function M.load()
	local co = coroutine.running()
	assert(co)
	local context_id, context_type = fbinstant.get_context()
	local post_data = rxijson.encode({
		signature = get_signed_player_info(context_id),
	})

	local response = async.http_request(ignore_cache(BACKEND_URL .. "/get-match"), "POST", HEADERS, post_data)
	if response.status < 200 or response.status > 399 then
		return nil, ("Error when loading data. Status: %d"):format(response.status)
	end

	local decoded_response = nil
	local ok, err = pcall(function()
		decoded_response = json.decode(response.response)
	end)
	if not ok then
		return nil, ("Unable to decode response. Err: %s"):format(err)
	end
	if not decoded_response.success then
		return nil, ("Request wasn't successful. Err: %s"):format(decoded_response.error)
	end

	local match_data = nil
	local ok, err = pcall(function()
		match_data = json.decode(decoded_response.data)
	end)
	if not ok then
		return nil, ("Unable to decode match data. Err: %s"):format(err)
	end
	return match_data
end


return M
