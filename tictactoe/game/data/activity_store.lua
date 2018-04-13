local rxijson = require "fbinstant.utils.json"
local async = require "tictactoe.utils.async"

local M = {}

local STORE_NAME = "gamestate"
local KEYS = rxijson.encode({"gameState", "players", "playerTurn"})


local function check_store(done)
	fbinstant.get_stores(function(self, stores)
		stores = json.decode(stores or "[]")
		for _,store in pairs(stores) do
			if store.name == STORE_NAME then
				done(true)
				return
			end
		end
		done(false)
	end)
end


local function create_store(done)
	print("create_store")
	fbinstant.create_store(STORE_NAME, function(self, store_id)
		print("create_store done", store_id)
		done(store_id)
	end)
end


local function load_data(cb)
	fbinstant.get_store_data(STORE_NAME, KEYS, function(self, data)
		if data then
			data = json.decode(data)
		end
		cb(data)
	end)
end

local function save_data(cb, data)
	fbinstant.save_store_data(STORE_NAME, data, function(self, success)
		cb(success)
	end)
end


function M.save(data)
	local exist = async(check_store)
	if not exist then
		async(create_store)
	end
	return async(save_data, rxijson.encode(data))
end

function M.load()
	local exist = async(check_store)
	if not exist then
		async(create_store)
	end
	return async(load_data)
end


return M
