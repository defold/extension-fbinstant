#include "fbinstant.h"
#include "luautils.h"
#include <dmsdk/sdk.h>

#define LIB_NAME "FBInstant"
#define MODULE_NAME "fbinstant"
#define DLIB_LOG_DOMAIN LIB_NAME

#if defined(DM_PLATFORM_HTML5)

// ===============================================
// INITIALIZE
// ===============================================
lua_Listener initializeAsyncListener;

static void FBInstant_OnInitialized(const int success) {
	lua_State* L = initializeAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, initializeAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_InitializeAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, initializeAsyncListener);
	FBInstant_PlatformInitializeAsync((OnInitializedCallback)FBInstant_OnInitialized);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// UPDATE
// ===============================================
lua_Listener updateAsyncListener;

static void FBInstant_OnUpdated(const int success) {
	lua_State* L = updateAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, updateAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_UpdateAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* json_payload = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, updateAsyncListener);
	FBInstant_PlatformUpdateAsync((OnUpdatedCallback)FBInstant_OnUpdated, json_payload);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET/SET/FLUSH PLAYER DATA
// ===============================================
lua_Listener getDataAsyncListener;

static void FBInstant_OnPlayerData(const char* data) {
	lua_State* L = getDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getDataAsyncListener);
	lua_pushstring(L, data);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetPlayerDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* keysJson = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, getDataAsyncListener);
	FBInstant_PlatformGetPlayerDataAsync((OnPlayerDataCallback)FBInstant_OnPlayerData, keysJson);

	assert(top == lua_gettop(L));
	return 0;
}


lua_Listener setDataAsyncListener;

static void FBInstant_OnPlayerDataSet(const int success) {
	lua_State* L = setDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, setDataAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SetPlayerDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* json = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, setDataAsyncListener);
	FBInstant_PlatformSetPlayerDataAsync((OnPlayerDataSetCallback)FBInstant_OnPlayerDataSet, json);

	assert(top == lua_gettop(L));
	return 0;
}


lua_Listener flushDataAsyncListener;

static void FBInstant_OnPlayerDataFlushed(const int success) {
	lua_State* L = flushDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, flushDataAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}
static int FBInstant_FlushPlayerDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, flushDataAsyncListener);
	FBInstant_PlatformFlushPlayerDataAsync((OnPlayerDataFlushedCallback)FBInstant_OnPlayerDataFlushed);

	assert(top == lua_gettop(L));
	return 0;
}



// ===============================================
// GET/SET PLAYER STATS
// ===============================================
lua_Listener getStatsAsyncListener;

static void FBInstant_OnPlayerStats(const char* stats) {
	lua_State* L = getStatsAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getStatsAsyncListener);
	lua_pushstring(L, stats);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetPlayerStatsAsync(lua_State* L) {
	int top = lua_gettop(L);

	int type = lua_type(L, 1);
	if (type == LUA_TFUNCTION) {
		luaL_checklistener(L, 1, getStatsAsyncListener);
		FBInstant_PlatformGetPlayerStatsAsync((OnPlayerStatsCallback)FBInstant_OnPlayerStats, "");
	}
	else {
		const char* statsJson = luaL_checkstring(L, 1);
		luaL_checklistener(L, 2, getStatsAsyncListener);
		FBInstant_PlatformGetPlayerStatsAsync((OnPlayerStatsCallback)FBInstant_OnPlayerStats, statsJson);
	}

	assert(top == lua_gettop(L));
	return 0;
}


lua_Listener setStatsAsyncListener;

static void FBInstant_OnPlayerStatsSet(const int success) {
	lua_State* L = setStatsAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, setStatsAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SetPlayerStatsAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* json = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, setStatsAsyncListener);
	FBInstant_PlatformSetPlayerStatsAsync((OnPlayerStatsSetCallback)FBInstant_OnPlayerStatsSet, json);

	assert(top == lua_gettop(L));
	return 0;
}


lua_Listener incrementStatsAsyncListener;

static void FBInstant_OnPlayerStatsIncremented(const char* stats) {
	lua_State* L = incrementStatsAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, incrementStatsAsyncListener);
	if (stats != NULL) {
		lua_pushstring(L, stats);
	}
	else {
		lua_pushnil(L);
	}
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_IncrementPlayerStatsAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* json = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, incrementStatsAsyncListener);
	FBInstant_PlatformIncrementPlayerStatsAsync((OnPlayerStatsIncrementedCallback)FBInstant_OnPlayerStatsIncremented, json);

	assert(top == lua_gettop(L));
	return 0;
}


lua_Listener getConnectedPlayersAsyncListener;

static void FBInstant_OnConnectedPlayers(const char* players) {
	lua_State* L = getConnectedPlayersAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getConnectedPlayersAsyncListener);
	if (players != NULL) {
		lua_pushstring(L, players);
	}
	else {
		lua_pushnil(L);
	}
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetConnectedPlayersAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, getConnectedPlayersAsyncListener);
	FBInstant_PlatformGetConnectedPlayersAsync((OnConnectedPlayersCallback)FBInstant_OnConnectedPlayers);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// START GAME
// ===============================================
lua_Listener startGameAsyncListener;

static void FBInstant_OnGameStarted(const int success) {
	lua_State* L = startGameAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, startGameAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_StartGameAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, startGameAsyncListener);
	FBInstant_PlatformStartGameAsync((OnGameStartedCallback)FBInstant_OnGameStarted);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SWITCH GAME
// ===============================================
lua_Listener switchGameAsyncListener;

static void FBInstant_OnGameSwitched(const int success) {
	lua_State* L = switchGameAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, switchGameAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SwitchGameAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* appId = luaL_checkstring(L, 1);
	const char* dataJson;
	if (lua_isstring(L, 2)) {
		dataJson = luaL_checkstring(L, 2);
	}
	else {
		dataJson = "";
	}
	luaL_checklistener(L, 3, switchGameAsyncListener);
	FBInstant_PlatformSwitchGameAsync((OnGameSwitchedCallback)FBInstant_OnGameSwitched);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET PLAYER
// ===============================================
static int FBInstant_GetPlayer(lua_State* L) {
	int top = lua_gettop(L);

	lua_newtable(L);
	lua_pushtablestringstring(L, "name", FBInstant_PlatformGetPlayerName());
	lua_pushtablestringstring(L, "id", FBInstant_PlatformGetPlayerId());
	lua_pushtablestringstring(L, "photo", FBInstant_PlatformGetPlayerPhoto());
	lua_pushtablestringstring(L, "locale", FBInstant_PlatformGetPlayerLocale());

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// CAN SUBSCRIBE BOT
// ===============================================
lua_Listener canSubscribeBotAsyncListener;

static void FBInstant_OnCanSubscribeBot(const int success) {
	lua_State* L = canSubscribeBotAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, canSubscribeBotAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CanSubscribeBotAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, canSubscribeBotAsyncListener);
	FBInstant_PlatformCanSubscribeBotAsync((OnCanSubscribeBotCallback)FBInstant_OnCanSubscribeBot);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SUBSCRIBE BOT
// ===============================================
lua_Listener subscribeBotAsyncListener;

static void FBInstant_OnSubscribeBot(const int success) {
	lua_State* L = subscribeBotAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, subscribeBotAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SubscribeBotAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, subscribeBotAsyncListener);
	FBInstant_PlatformSubscribeBotAsync((OnSubscribeBotCallback)FBInstant_OnSubscribeBot);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET ENTRY POINT DATA
// ===============================================
static int FBInstant_GetEntryPointData(lua_State* L) {
	int top = lua_gettop(L);

	const char* data = FBInstant_PlatformGetEntryPointData();
	if (data) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// GET ENTRY POINT
// ===============================================
lua_Listener getEntryPointAsyncListener;

static void FBInstant_OnEntryPoint(const char* entrypoint) {
	lua_State* L = getEntryPointAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getEntryPointAsyncListener);
	if (entrypoint != NULL) {
		lua_pushstring(L, entrypoint);
	}
	else {
		lua_pushnil(L);
	}
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetEntryPointAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, getEntryPointAsyncListener);
	FBInstant_PlatformGetEntryPointAsync((OnEntryPointCallback)FBInstant_OnEntryPoint);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SET SESSION DATA
// ===============================================
static int FBInstant_SetSessionData(lua_State* L) {
	int top = lua_gettop(L);

	const char* json_data = luaL_checkstring(L, 1);
	FBInstant_PlatformSetSessionData(json_data);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// QUIT
// ===============================================
static int FBInstant_Quit(lua_State* L) {
	int top = lua_gettop(L);

	FBInstant_PlatformQuit();

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// ON PAUSE
// ===============================================
lua_Listener onPauseListener;

static void FBInstant_OnPause() {
	lua_State* L = onPauseListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, onPauseListener);
	int ret = lua_pcall(L, 1, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_OnPause(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, onPauseListener);
	FBInstant_PlatformOnPause((OnPauseCallback)FBInstant_OnPause);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SET LOADING PROGRESS
// ===============================================
static int FBInstant_SetLoadingProgress(lua_State* L) {
	int top = lua_gettop(L);

	int progress = luaL_checknumber(L, 1);
	FBInstant_PlatformSetLoadingProgress(progress);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// CHOOSE CONTEXT
// ===============================================
lua_Listener chooseContextAsyncListener;

static void FBInstant_OnContextChosen(const char* id, const char* type) {
	lua_State* L = chooseContextAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, chooseContextAsyncListener);
	lua_pushstring(L, id);
	lua_pushstring(L, type);
	int ret = lua_pcall(L, 3, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_ChooseContextAsync(lua_State* L) {
	int top = lua_gettop(L);

	int type = lua_type(L, 1);
	if (type == LUA_TFUNCTION) {
		luaL_checklistener(L, 1, chooseContextAsyncListener);
		FBInstant_PlatformChooseContextAsync((OnContextCallback)FBInstant_OnContextChosen, "");
	}
	else {
		const char* optionsJson;
		if (lua_isstring(L, 1)) {
			optionsJson = luaL_checkstring(L, 1);
		}
		else {
			optionsJson = "";
		}
		luaL_checklistener(L, 2, chooseContextAsyncListener);
		FBInstant_PlatformChooseContextAsync((OnContextCallback)FBInstant_OnContextChosen, optionsJson);
	}

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// CREATE CONTEXT
// ===============================================
lua_Listener createContextAsyncListener;

static void FBInstant_OnContextCreated(const char* id, const char* type) {
	lua_State* L = createContextAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, createContextAsyncListener);
	lua_pushstring(L, id);
	lua_pushstring(L, type);
	int ret = lua_pcall(L, 3, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CreateContextAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* playerId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, createContextAsyncListener);
	FBInstant_PlatformCreateContextAsync((OnContextCallback)FBInstant_OnContextCreated, playerId);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SWITCH CONTEXT
// ===============================================
lua_Listener switchContextAsyncListener;

static void FBInstant_OnContextSwitched(const char* id, const char* type) {
	lua_State* L = switchContextAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, switchContextAsyncListener);
	lua_pushstring(L, id);
	lua_pushstring(L, type);
	int ret = lua_pcall(L, 3, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SwitchContextAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* contextId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, switchContextAsyncListener);
	FBInstant_PlatformSwitchContextAsync((OnContextCallback)FBInstant_OnContextSwitched, contextId);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET CONTEXT
// ===============================================
static int FBInstant_GetContext(lua_State* L) {
	int top = lua_gettop(L);

	const char* id = FBInstant_PlatformGetContextID();
	const char* type = FBInstant_PlatformGetContextType();

	if(id == 0) {
		lua_pushnil(L);
	}
	else {
		lua_pushstring(L, id);
	}
	if(type == 0) {
		lua_pushnil(L);
	}
	else {
		lua_pushstring(L, type);
	}

	assert(top + 2 == lua_gettop(L));
	return 2;
}


// ===============================================
// GET PLAYERS IN CONTEXT
// ===============================================
lua_Listener playersInContextAsyncListener;

static void FBInstant_OnGetPlayersInContext(int count) {
	lua_State* L = playersInContextAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, playersInContextAsyncListener);

	lua_newtable(L);
	for (int i = 0; i < count; i++) {
		lua_pushnumber(L, i + 1);
		lua_newtable(L);
		lua_pushtablestringstring(L, "id", FBInstant_PlatformGetPlayerIdInContext(i));
		lua_pushtablestringstring(L, "name", FBInstant_PlatformGetPlayerNameInContext(i));
		lua_pushtablestringstring(L, "photo", FBInstant_PlatformGetPlayerPhotoInContext(i));
		lua_settable(L, -3);
	}

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetPlayersInContextAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, playersInContextAsyncListener);
	FBInstant_PlatformGetPlayersInContextAsync((OnGetPlayersInContext)FBInstant_OnGetPlayersInContext);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET PLATFORM ("IOS" | "ANDROID" | "WEB" | "MOBILE_WEB")
// ===============================================
static int FBInstant_GetPlatform(lua_State* L) {
	int top = lua_gettop(L);

	const char* data = FBInstant_PlatformGetPlatform();
	if (data) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// GET LOCALE
// ===============================================
static int FBInstant_GetLocale(lua_State* L) {
	int top = lua_gettop(L);

	const char* data = FBInstant_PlatformGetLocale();
	if (data) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// GET SUPPORTED APIS
// ===============================================
static int FBInstant_GetSupportedAPIs(lua_State* L) {
	int top = lua_gettop(L);

	const char* data = FBInstant_PlatformGetSupportedAPIs();
	if (data) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// GET SDK VERSION
// ===============================================
static int FBInstant_GetSDKVersion(lua_State* L) {
	int top = lua_gettop(L);

	const char* data = FBInstant_PlatformGetSDKVersion();
	if (data) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	assert(top + 1 == lua_gettop(L));
	return 1;
}


// ===============================================
// CAN CREATE SHORTCUT
// ===============================================
lua_Listener canCreateShortcutAsyncListener;

static void FBInstant_OnCanCreateShortcut(const int success) {
	lua_State* L = canCreateShortcutAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, canCreateShortcutAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CanCreateShortcutAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, canCreateShortcutAsyncListener);
	FBInstant_PlatformCanCreateShortcutAsync((OnCanCreateShortcutCallback)FBInstant_OnCanCreateShortcut);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// CREATE SHORTCUT
// ===============================================
lua_Listener createShortcutAsyncListener;

static void FBInstant_OnCreateShortcut(const int success) {
	lua_State* L = createShortcutAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, createShortcutAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CreateShortcutAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, createShortcutAsyncListener);
	FBInstant_PlatformCreateShortcutAsync((OnCreateShortcutCallback)FBInstant_OnCreateShortcut);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SHARE
// ===============================================
lua_Listener shareAsyncListener;

static void FBInstant_OnShare(int success) {
	lua_State* L = shareAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, shareAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_ShareAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* payloadJson = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, shareAsyncListener);
	FBInstant_PlatformShareAsync((OnShareCallback)FBInstant_OnShare, payloadJson);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// LOG EVENT
// ===============================================
static int FBInstant_LogEvent(lua_State* L) {
	int top = lua_gettop(L);

	const char* eventName = luaL_checkstring(L, 1);
	int valueToSum = luaL_checknumber(L, 2);
	const char* parametersJson = luaL_checkstring(L, 3);
	FBInstant_PlatformLogEvent(eventName, valueToSum, parametersJson);

	assert(top == lua_gettop(L));
	return 0;
}

// ===============================================
// IS SIZE BETWEEN
// ===============================================
static int FBInstant_IsSizeBetween(lua_State* L) {
	int top = lua_gettop(L);

	const int min = luaL_checkinteger(L, 1);
	const int max = luaL_checkinteger(L, 2);
	int result = FBInstant_PlatformIsSizeBetween(min, max);
	lua_pushboolean(L, result);

	assert(top + 1 == lua_gettop(L));
	return 1;
}



// ===============================================
// CREATE STORE ASYNC
// ===============================================
lua_Listener createStoreAsyncListener;

static void FBInstant_OnStoreCreated(const char* storeId) {
	lua_State* L = createStoreAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, createStoreAsyncListener);
	if(storeId != NULL) {
		lua_pushstring(L, storeId);
	}
	else {
		lua_pushnil(L);
	}
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CreateStoreAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* storeName = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, createStoreAsyncListener);
	FBInstant_PlatformCreateStoreAsync((OnStoreCreatedCallback)FBInstant_OnStoreCreated, storeName);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// CLOSE STORE ASYNC
// ===============================================
lua_Listener closeStoreAsyncListener;

static void FBInstant_OnStoreClosed(const int success) {
	lua_State* L = closeStoreAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, closeStoreAsyncListener);
	int ret = lua_pcall(L, 1, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_CloseStoreAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* storeName = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, createStoreAsyncListener);
	FBInstant_PlatformCloseStoreAsync((OnStoreClosedCallback)FBInstant_OnStoreClosed, storeName);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET STORES ASYNC
// ===============================================
lua_Listener getStoresAsyncListener;

static void FBInstant_OnStores(const char* stores) {
	lua_State* L = getStoresAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getStoresAsyncListener);
	if(stores != NULL) {
		lua_pushstring(L, stores);
	}
	else {
		lua_pushnil(L);
	}

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetStoresAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, getStoresAsyncListener);
	FBInstant_PlatformGetStoresAsync((OnStoresCallback)FBInstant_OnStores);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET STORE DATA ASYNC
// ===============================================
lua_Listener getStoreDataAsyncListener;

static void FBInstant_OnStoreData(const char* data) {
	lua_State* L = getStoreDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getStoreDataAsyncListener);
	if(data != NULL) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetStoreDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* storeName = luaL_checkstring(L, 1);
	const char* keysJson = luaL_checkstring(L, 2);
	luaL_checklistener(L, 3, getStoreDataAsyncListener);
	FBInstant_PlatformGetStoreDataAsync((OnStoreDataCallback)FBInstant_OnStoreData, storeName, keysJson);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// SAVE STORE DATA ASYNC
// ===============================================
lua_Listener saveStoreDataAsyncListener;

static void FBInstant_OnStoreDataSaved(const int success) {
	lua_State* L = saveStoreDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, saveStoreDataAsyncListener);
	lua_pushboolean(L, success);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SaveStoreDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* storeName = luaL_checkstring(L, 1);
	const char* dataJson = luaL_checkstring(L, 2);
	luaL_checklistener(L, 3, saveStoreDataAsyncListener);
	FBInstant_PlatformSaveStoreDataAsync((OnStoreDataSavedCallback)FBInstant_OnStoreDataSaved, storeName, dataJson);

	assert(top == lua_gettop(L));
	return 0;
}

// ===============================================
// INCREMENT STORE DATA ASYNC
// ===============================================
lua_Listener incrementStoreDataAsyncListener;

static void FBInstant_OnStoreDataIncremented(const char* data) {
	lua_State* L = incrementStoreDataAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, incrementStoreDataAsyncListener);
	if(data != NULL) {
		lua_pushstring(L, data);
	}
	else {
		lua_pushnil(L);
	}

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_IncrementStoreDataAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* storeName = luaL_checkstring(L, 1);
	const char* dataJson = luaL_checkstring(L, 2);
	luaL_checklistener(L, 3, incrementStoreDataAsyncListener);
	FBInstant_PlatformIncrementStoreDataAsync((OnStoreDataIncrementedCallback)FBInstant_OnStoreDataIncremented, storeName, dataJson);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// LOAD INTERSTITIAL AD
// ===============================================
lua_Listener loadInterstitialAdAsyncListener;

static void FBInstant_OnInterstitialAdLoaded(const int success) {
	lua_State* L = loadInterstitialAdAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, loadInterstitialAdAsyncListener);
	lua_pushboolean(L, success);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_LoadInterstitialAdAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* placementId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, loadInterstitialAdAsyncListener);
	FBInstant_PlatformLoadInterstitialAdAsync((OnInterstitialAdLoadedCallback)FBInstant_OnInterstitialAdLoaded, placementId);

	assert(top == lua_gettop(L));
	return 0;
}




// ===============================================
// SHOW INTERSTITIAL AD
// ===============================================
lua_Listener showInterstitialAdAsyncListener;

static void FBInstant_OnInterstitialAdShown(const int success) {
	lua_State* L = showInterstitialAdAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, showInterstitialAdAsyncListener);
	lua_pushboolean(L, success);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_ShowInterstitialAdAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* placementId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, showInterstitialAdAsyncListener);
	FBInstant_PlatformShowInterstitialAdAsync((OnInterstitialAdShownCallback)FBInstant_OnInterstitialAdShown, placementId);

	assert(top == lua_gettop(L));
	return 0;
}





// ===============================================
// LOAD REWARDED VIDEO
// ===============================================
lua_Listener loadRewardedVideoAsyncListener;

static void FBInstant_OnRewardedVideoLoaded(const int success) {
	lua_State* L = loadRewardedVideoAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, loadRewardedVideoAsyncListener);
	lua_pushboolean(L, success);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_LoadRewardedVideoAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* placementId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, loadRewardedVideoAsyncListener);
	FBInstant_PlatformLoadRewardedVideoAsync((OnRewardedVideoLoadedCallback)FBInstant_OnRewardedVideoLoaded, placementId);

	assert(top == lua_gettop(L));
	return 0;
}




// ===============================================
// SHOW REWARDED VIDEO
// ===============================================
lua_Listener showRewardedVideoAsyncListener;

static void FBInstant_OnRewardedVideoShown(const int success) {
	lua_State* L = showRewardedVideoAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, showRewardedVideoAsyncListener);
	lua_pushboolean(L, success);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_ShowRewardedVideoAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* placementId = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, showRewardedVideoAsyncListener);
	FBInstant_PlatformShowRewardedVideoAsync((OnRewardedVideoShownCallback)FBInstant_OnRewardedVideoShown, placementId);

	assert(top == lua_gettop(L));
	return 0;
}



// ===============================================
// GET SIGNED PLAYER INFO
// ===============================================
lua_Listener getSignedPlayerInfoAsyncListener;

static void FBInstant_OnSignedPlayerInfo(const char* signature) {
	lua_State* L = getSignedPlayerInfoAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getSignedPlayerInfoAsyncListener);
	lua_pushstring(L, signature);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetSignedPlayerInfoAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* requestPayload = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, getSignedPlayerInfoAsyncListener);
	FBInstant_PlatformGetSignedPlayerInfoAsync((OnSignedPlayerInfoCallback)FBInstant_OnSignedPlayerInfo, requestPayload);

	assert(top == lua_gettop(L));
	return 0;
}



// ===============================================
// GET LEADERBOARD
// ===============================================
lua_Listener getLeaderboardAsyncListener;

static void FBInstant_OnGetLeaderboard(const char* contextId, const int entryCount) {
	lua_State* L = getLeaderboardAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getLeaderboardAsyncListener);
	lua_pushstring(L, contextId);
	lua_pushnumber(L, entryCount);

	int ret = lua_pcall(L, 3, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetLeaderboardAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* name = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, getLeaderboardAsyncListener);
	FBInstant_PlatformGetLeaderboardAsync((OnLeaderboardCallback)FBInstant_OnGetLeaderboard, name);

	assert(top == lua_gettop(L));
	return 0;
}



// ===============================================
// SET LEADERBOARD SCORE
// ===============================================
lua_Listener setLeaderboardScoreAsyncListener;

static void FBInstant_OnLeaderboardScoreSet(const int score, const char* extraData) {
	lua_State* L = setLeaderboardScoreAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, setLeaderboardScoreAsyncListener);
	lua_pushnumber(L, score);
	lua_pushstring(L, extraData);

	int ret = lua_pcall(L, 3, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_SetLeaderboardScoreAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* name = luaL_checkstring(L, 1);
	const int score = luaL_checkint(L, 2);
	const char* extraData;
	if (lua_isstring(L, 3)) {
		extraData = luaL_checkstring(L, 3);
	}
	else {
		extraData = "";
	}
	luaL_checklistener(L, 4, setLeaderboardScoreAsyncListener);
	FBInstant_PlatformSetLeaderboardScoreAsync((OnLeaderboardScoreSetCallback)FBInstant_OnLeaderboardScoreSet, name, score, extraData);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET LEADERBOARD SCORE
// ===============================================
lua_Listener getLeaderboardScoreAsyncListener;

static void FBInstant_OnLeaderboardScore(const int rank, const int score, const char* extraData) {
	lua_State* L = getLeaderboardScoreAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getLeaderboardScoreAsyncListener);
	lua_pushnumber(L, rank);
	lua_pushnumber(L, score);
	lua_pushstring(L, extraData);

	int ret = lua_pcall(L, 4, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetLeaderboardScoreAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* name = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, getLeaderboardScoreAsyncListener);
	FBInstant_PlatformGetLeaderboardScoreAsync((OnLeaderboardScoreCallback)FBInstant_OnLeaderboardScore, name);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET LEADERBOARD ENTRIES
// ===============================================
lua_Listener getLeaderboardEntriesAsyncListener;

static void FBInstant_OnLeaderboardEntries(const char* entries) {
	lua_State* L = getLeaderboardEntriesAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getLeaderboardEntriesAsyncListener);
	lua_pushstring(L, entries);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetLeaderboardEntriesAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* name = luaL_checkstring(L, 1);
	const int count = luaL_checkint(L, 2);
	const int offset = luaL_checkint(L, 3);
	luaL_checklistener(L, 4, getLeaderboardEntriesAsyncListener);
	FBInstant_PlatformGetLeaderboardEntriesAsync((OnLeaderboardEntriesCallback)FBInstant_OnLeaderboardEntries, name, count, offset);

	assert(top == lua_gettop(L));
	return 0;
}




// ===============================================
// ON PAYMENTS READY
// ===============================================
lua_Listener onPaymentsReadyListener;

static void FBInstant_OnPaymentsReady() {
	lua_State* L = onPaymentsReadyListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, onPaymentsReadyListener);
	int ret = lua_pcall(L, 1, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_OnPaymentsReady(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, onPaymentsReadyListener);
	FBInstant_PlatformOnPaymentsReady((OnPauseCallback)FBInstant_OnPaymentsReady);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET PRODUCT CATALOG
// ===============================================
lua_Listener getProductCatalogAsyncListener;

static void FBInstant_OnProductCatalog(const char* productCatalog) {
	lua_State* L = getProductCatalogAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getProductCatalogAsyncListener);
	lua_pushstring(L, productCatalog);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetProductCatalogAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, getProductCatalogAsyncListener);
	FBInstant_PlatformGetProductCatalogAsync((OnProductCatalogCallback)FBInstant_OnProductCatalog);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// PURCHASE
// ===============================================
lua_Listener purchaseAsyncListener;

static void FBInstant_OnPurchaseResponse(const char* purchase) {
	lua_State* L = purchaseAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, purchaseAsyncListener);
	lua_pushstring(L, purchase);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_PurchaseAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* productId = luaL_checkstring(L, 1);
	const char* developerPayload = luaL_checkstring(L, 2);
	luaL_checklistener(L, 3, purchaseAsyncListener);
	FBInstant_PlatformPurchaseAsync((OnPurchaseResponseCallback)FBInstant_OnPurchaseResponse, productId, developerPayload);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// GET PURCHASES
// ===============================================
lua_Listener getPurchasesAsyncListener;

static void FBInstant_OnPurchases(const char* purchases) {
	lua_State* L = getPurchasesAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, getPurchasesAsyncListener);
	lua_pushstring(L, purchases);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_GetPurchasesAsync(lua_State* L) {
	int top = lua_gettop(L);

	luaL_checklistener(L, 1, getPurchasesAsyncListener);
	FBInstant_PlatformGetPurchasesAsync((OnPurchasesCallback)FBInstant_OnPurchases);

	assert(top == lua_gettop(L));
	return 0;
}


// ===============================================
// CONSUME PURCHASE
// ===============================================
lua_Listener consumePurchaseAsyncListener;

static void FBInstant_OnPurchaseConsumed(const int success) {
	lua_State* L = consumePurchaseAsyncListener.m_L;
	int top = lua_gettop(L);

	lua_pushlistener(L, consumePurchaseAsyncListener);
	lua_pushboolean(L, success);

	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0) {
		lua_pop(L, 1);
	}

	assert(top == lua_gettop(L));
}

static int FBInstant_ConsumePurchaseAsync(lua_State* L) {
	int top = lua_gettop(L);

	const char* purchaseToken = luaL_checkstring(L, 1);
	luaL_checklistener(L, 2, consumePurchaseAsyncListener);
	FBInstant_PlatformConsumePurchaseAsync((OnPurchaseConsumedCallback)FBInstant_OnPurchaseConsumed, purchaseToken);

	assert(top == lua_gettop(L));
	return 0;
}



static const luaL_reg Module_methods[] = {
	// lifecycle functions
	{"initialize", FBInstant_InitializeAsync},
	{"set_loading_progress", FBInstant_SetLoadingProgress},
	{"start_game", FBInstant_StartGameAsync},
	{"switch_game", FBInstant_SwitchGameAsync},
	{"update", FBInstant_UpdateAsync},
	{"on_pause", FBInstant_OnPause},
	{"quit", FBInstant_Quit},

	// event logging
	{"log_event", FBInstant_LogEvent},

	// misc
	{"get_platform", FBInstant_GetPlatform},
	{"get_locale", FBInstant_GetLocale},
	{"get_supported_apis", FBInstant_GetSupportedAPIs},
	{"get_sdk_version", FBInstant_GetSDKVersion},
	{"share", FBInstant_ShareAsync},
	{"can_create_shortcut", FBInstant_CanCreateShortcutAsync},
	{"create_shortcut", FBInstant_CreateShortcutAsync},

	// ads
	{"load_interstitial_ad", FBInstant_LoadInterstitialAdAsync},
	{"show_interstitial_ad", FBInstant_ShowInterstitialAdAsync},
	{"load_rewarded_video", FBInstant_LoadRewardedVideoAsync},
	{"show_rewarded_video", FBInstant_ShowRewardedVideoAsync},

	// session and entry data
	{"get_entry_point_data", FBInstant_GetEntryPointData},
	{"get_entry_point", FBInstant_GetEntryPointAsync},
	{"set_session_data", FBInstant_SetSessionData},

	// player functions
	{"get_player", FBInstant_GetPlayer},
	{"get_player_data", FBInstant_GetPlayerDataAsync},
	{"set_player_data", FBInstant_SetPlayerDataAsync},
	{"flush_player_data", FBInstant_FlushPlayerDataAsync},
	{"get_player_stats", FBInstant_GetPlayerStatsAsync},
	{"set_player_stats", FBInstant_SetPlayerStatsAsync},
	{"increment_player_stats", FBInstant_IncrementPlayerStatsAsync},
	{"get_connected_players", FBInstant_GetConnectedPlayersAsync},
	{"can_subscribe_bot", FBInstant_CanSubscribeBotAsync},
	{"subscribe_bot", FBInstant_SubscribeBotAsync},
	{"get_signed_player_info", FBInstant_GetSignedPlayerInfoAsync},

	// context functions
	{"choose_context", FBInstant_ChooseContextAsync},
	{"get_context", FBInstant_GetContext},
	{"create_context", FBInstant_CreateContextAsync},
	{"switch_context", FBInstant_SwitchContextAsync},
	{"is_size_between", FBInstant_IsSizeBetween},
	{"get_players", FBInstant_GetPlayersInContextAsync},

	// activity store functions
	{"create_store", FBInstant_CreateStoreAsync},
	{"close_store", FBInstant_CloseStoreAsync},
	{"get_stores", FBInstant_GetStoresAsync},
	{"get_store_data", FBInstant_GetStoreDataAsync},
	{"save_store_data", FBInstant_SaveStoreDataAsync},
	{"increment_store_data", FBInstant_IncrementStoreDataAsync},

	// leaderboard functions
	{"get_leaderboard", FBInstant_GetLeaderboardAsync},
	{"set_leaderboard_score", FBInstant_SetLeaderboardScoreAsync},
	{"get_leaderboard_score", FBInstant_GetLeaderboardScoreAsync},
	{"get_leaderboard_entries", FBInstant_GetLeaderboardEntriesAsync},


	// payments functions
	{"on_payments_ready", FBInstant_OnPaymentsReady},
	{"get_product_catalog", FBInstant_GetProductCatalogAsync},
	{"purchase", FBInstant_PurchaseAsync},
	{"get_purchases", FBInstant_GetPurchasesAsync},
	{"consume_purchase", FBInstant_ConsumePurchaseAsync},

	{0, 0}
};

static void LuaInit(lua_State* L) {
    int top = lua_gettop(L);
    luaL_register(L, MODULE_NAME, Module_methods);

	lua_setfieldstringstring(L, "CONTEXT_SOLO", "SOLO");
	lua_setfieldstringstring(L, "CONTEXT_POST", "POST");
	lua_setfieldstringstring(L, "CONTEXT_THREAD", "THREAD");
	lua_setfieldstringstring(L, "CONTEXT_GROUP", "GROUP");

	lua_setfieldstringstring(L, "SHARE_INTENT_INVITE", "INVITE");
	lua_setfieldstringstring(L, "SHARE_INTENT_REQUEST", "REQUEST");
	lua_setfieldstringstring(L, "SHARE_INTENT_CHALLENGE", "CHALLENGE");
	lua_setfieldstringstring(L, "SHARE_INTENT_SHARE", "SHARE");

	lua_setfieldstringstring(L, "FILTER_NEW_CONTEXT_ONLY", "NEW_CONTEXT_ONLY");
	lua_setfieldstringstring(L, "FILTER_INCLUDE_EXISTING_CHALLENGES", "INCLUDE_EXISTING_CHALLENGES");
	lua_setfieldstringstring(L, "FILTER_NEW_PLAYERS_ONLY", "NEW_PLAYERS_ONLY");

	lua_setfieldstringstring(L, "STORE_ACTIVE", "ACTIVE");
	lua_setfieldstringstring(L, "STORE_ENDED", "ENDED");

    lua_pop(L, 1);
    assert(top == lua_gettop(L));
}
#endif

dmExtension::Result AppInitializeFBInstantExtension(dmExtension::AppParams* params) {
    return dmExtension::RESULT_OK;
}

dmExtension::Result InitializeFBInstantExtension(dmExtension::Params* params) {
	#if defined(DM_PLATFORM_HTML5)
		LuaInit(params->m_L);
	#else
		printf("Extension %s is not supported\n", MODULE_NAME);
	#endif
	return dmExtension::RESULT_OK;
}

dmExtension::Result AppFinalizeFBInstantExtension(dmExtension::AppParams* params) {
	return dmExtension::RESULT_OK;
}

dmExtension::Result FinalizeFBInstantExtension(dmExtension::Params* params) {
	return dmExtension::RESULT_OK;
}

dmExtension::Result UpdateFBInstantExtension(dmExtension::Params* params) {
	return dmExtension::RESULT_OK;
}

DM_DECLARE_EXTENSION(FBInstant, LIB_NAME, AppInitializeFBInstantExtension, AppFinalizeFBInstantExtension, InitializeFBInstantExtension, UpdateFBInstantExtension, 0, FinalizeFBInstantExtension)
