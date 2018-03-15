#include <dmsdk/sdk.h>
#include "luautils.h"

void luaL_checklistener(lua_State* L, int idx, struct lua_Listener& listener) {
	int top = lua_gettop(L);
	luaL_checktype(L, idx, LUA_TFUNCTION);
    lua_pushvalue(L, idx);
    int cb = dmScript::Ref(L, LUA_REGISTRYINDEX);

    if (listener.m_Callback != LUA_NOREF) {
      dmScript::Unref(listener.m_L, LUA_REGISTRYINDEX, listener.m_Callback);
      dmScript::Unref(listener.m_L, LUA_REGISTRYINDEX, listener.m_Self);
    }

    listener.m_L = dmScript::GetMainThread(L);
    listener.m_Callback = cb;
    dmScript::GetInstance(L);
    listener.m_Self = dmScript::Ref(L, LUA_REGISTRYINDEX);
	assert(top == lua_gettop(L));
}

void lua_pushlistener(lua_State* L, struct lua_Listener& listener) {
	int top = lua_gettop(L);

	// get the function callback from the registry and push it to the top of the stack
	lua_rawgeti(L, LUA_REGISTRYINDEX, listener.m_Callback);
	// get self from registry and push it to the top of the stack
	lua_rawgeti(L, LUA_REGISTRYINDEX, listener.m_Self);
	// push copy of self to top of the stack
	lua_pushvalue(L, -1);
	// set current script instance from top of the stack (and pop it)
	dmScript::SetInstance(L);

	assert(top + 2 == lua_gettop(L));
}

void lua_pushtablestringstring(lua_State* L, const char* key, const char* value) {
	int top = lua_gettop(L);
	lua_pushstring(L, key);
	lua_pushstring(L, value);
	lua_settable(L, -3);
	assert(top == lua_gettop(L));
}


void lua_printstack(lua_State* L) {
	int n = lua_gettop(L);
	for (int i = 1; i <= n; i++)  {
		dmLogInfo("STACK %d %s %s\r\n", i, lua_tostring(L, i), luaL_typename(L, i));
	}
}


void lua_setfieldstringstring(lua_State* L, const char* key, const char* value) {
	int top = lua_gettop(L);
	lua_pushstring(L, value);
	lua_setfield(L, -2, key);
	assert(top == lua_gettop(L));
}
