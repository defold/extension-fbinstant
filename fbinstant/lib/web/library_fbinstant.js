// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var FBInstantLibrary = {

    $Context: {
        players: [],
        setPlayers: function(players_to_set) {
            // remove old players and free allocations
            var player;
            while (Context.players.length > 0) {
                player = Context.players.pop();
                Module._free(player.id);
                Module._free(player.name);
                Module._free(player.photo);
            }
            // create new player objects with allocated strings
            for (var i=0; i<players_to_set.length; i++) {
                player = players_to_set[i];
                Context.players.push({
                    id: Utils.allocateString(player.getID()),
                    name: Utils.allocateString(player.getName()),
                    photo: Utils.allocateString(player.getPhoto()),
                });
            }
        }
    },

    $Utils: {
        strings: {},
        manageString: function(key, value) {
            if (Utils.strings[key] != null) {
                Module._free(Utils.strings[key].ptr);
            }
            Utils.strings[key] = {
                ptr: Utils.allocateString(value),
                str: value
            };
            return Utils.strings[key].ptr;
        },
        allocateString: function(str) {
            return allocate(intArrayFromString(str), "i8", ALLOC_NORMAL);
        },
        convertPurchase: function(purchase) {
            return {
                developer_payload: purchase.developerPayload,
                payment_id: purchase.paymentID,
                product_id: purchase.productID,
                purchase_time: purchase.purchaseTime,
                purchase_token: purchase.purchaseToken,
                signed_request: purchase.signedRequest,
            };
        },
        dynCall: function(fn, in_args) {
            var signature = "v";
            var out_args = [];
            var i;
            for (i=0; i < in_args.length; i++) {
                signature = signature + "i";
                out_args.push((typeof in_args[i] == "string") ? Utils.allocateString(in_args[i]) : in_args[i]);
            }
            Runtime.dynCall(signature, fn, out_args.slice());
            for (i=0; i < in_args.length; i++) {
                if (typeof in_args[i] == "string") Module._free(out_args[i]);
            }
        },
    },

    $Ads: {
        instances: [],
        instanceCount: 0,
        remove: function(id) {
            for(var i=0; i<Ads.instances.length; i++) {
                var instance = Ads.instances[i];
                if (instance.id == id) {
                    Ads.instances.splice(i, 1);
                    return instance.ad;
                }
            }
            return null;
        },
        find: function(id) {
            for(var i=0; i<Ads.instances.length; i++) {
                var instance = Ads.instances[i];
                if (instance.id == id) {
                    return instance.ad;
                }
            }
            return null;
        },
        insert: function(placementId, ad) {
            Ads.instanceCount = Ads.instanceCount + 1;
            var id = Ads.instanceCount.toString();
            Ads.instances.push({
                placementId: placementId,
                ad: ad,
                id: id,
            });
            return id;
        }
    },


    // =====================================
    // InitializeAsync
    // =====================================
    FBInstant_PlatformInitializeAsync: function(callback) {
        console.log("FBInstant inited", Module._fbinstant_inited);
        // Was FBInstant initialized externally? (ie from index.html)
        if (Module._fbinstant_inited == true) {
            Runtime.dynCall("vi", callback, [1]);
            return;
        }
        FBInstant.initializeAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformInitializeAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // UpdateAsync
    // =====================================
    FBInstant_PlatformUpdateAsync: function(callback, cpayloadjson) {
        var payloadjson = Pointer_stringify(cpayloadjson);
        var payload = JSON.parse(payloadjson);
        FBInstant.updateAsync(payload).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformUpdateAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // GetSignedPlayerInfoAsync
    // =====================================
    FBInstant_PlatformGetSignedPlayerInfoAsync: function(callback, cpayload) {
        var payload = Pointer_stringify(cpayload);
        FBInstant.player.getSignedPlayerInfoAsync(payload).then(function(result) {
            Utils.dynCall(callback, [result.getSignature()]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetSignedPlayerInfoAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // Get/Set/Flush PlayerData
    // =====================================
    FBInstant_PlatformGetPlayerDataAsync: function(callback, ckeysjson) {
        var keysJson = Pointer_stringify(ckeysjson);
        var keys = JSON.parse(keysJson);
        FBInstant.player.getDataAsync(keys).then(function(data) {
            Utils.dynCall(callback, [JSON.stringify(data)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformSetPlayerDataAsync: function(callback, cdatajson) {
        var datajson = Pointer_stringify(cdatajson);
        var data = JSON.parse(datajson);
        FBInstant.player.setDataAsync(data).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetPlayerDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformFlushPlayerDataAsync: function(callback) {
        FBInstant.player.flushDataAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformFlushPlayerDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // Get/Set/Increment PlayerStats
    // =====================================
    FBInstant_PlatformGetPlayerStatsAsync: function(callback, ckeysjson) {
        var keysJson = Pointer_stringify(ckeysjson);
        var keys = keysJson != "" ? JSON.parse(keysJson) : null;
        FBInstant.player.getStatsAsync(keys).then(function(stats) {
            Utils.dynCall(callback, [JSON.stringify(stats)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetPlayerStatsAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformSetPlayerStatsAsync: function(callback, cjson) {
        var json = Pointer_stringify(cjson);
        var stats = JSON.parse(json);
        FBInstant.player.setStatsAsync(stats).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetPlayerStatsAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformIncrementPlayerStatsAsync: function(callback, cjson) {
        var json = Pointer_stringify(cjson);
        var increments = JSON.parse(json);
        FBInstant.player.incrementStatsAsync(increments).then(function(stats) {
            Utils.dynCall(callback, [JSON.stringify(stats)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformIncrementPlayerStatsAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // GetConnectedPlayersAsync
    // =====================================
    FBInstant_PlatformGetConnectedPlayersAsync: function(callback) {
        FBInstant.player.getConnectedPlayersAsync().then(function(connected_players) {
            var players = [];
            for(var i=0; i<connected_players.length; i++) {
                var connected_player = connected_players[i];
                players.push({
                    id: connected_player.getID(),
                    name: connected_player.getName(),
                    photo: connected_player.getPhoto(),
                });
            }
            Utils.dynCall(callback, [JSON.stringify(players)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetConnectedPlayersAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // SetSessionData
    // =====================================
    FBInstant_PlatformSetSessionData: function(cjson) {
        var json = Pointer_stringify(cjson);
        var sessionData = JSON.parse(json);
        FBInstant.setSessionData(sessionData);
    },


    // =====================================
    // StartGameAsync
    // =====================================
    FBInstant_PlatformStartGameAsync: function(callback) {
        FBInstant.startGameAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformStartGameAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // SwitchGameAsync
    // =====================================
    FBInstant_PlatformSwitchGameAsync: function(cappId, cdataJson, callback) {
        var appId = Pointer_stringify(cappId);
        var dataJson = Pointer_stringify(cdataJson);
        var data = dataJson != "" ? JSON.parse(dataJson) : null;
        FBInstant.switchGameAsync(appId, data).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSwitchGameAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // OnPause
    // =====================================
    FBInstant_PlatformOnPause: function(callback) {
        FBInstant.onPause(function() {
            Runtime.dynCall("v", callback, []);
        });
    },


    // =====================================
    // Quit
    // =====================================
    FBInstant_PlatformQuit: function() {
        FBInstant.quit();
    },


    // =====================================
    // SetLoadingProgress
    // =====================================
    FBInstant_PlatformSetLoadingProgress: function(progress) {
        FBInstant.setLoadingProgress(progress);
    },


    // =====================================
    // GetPlayerName/Id/Locale/Photo
    // =====================================
    FBInstant_PlatformGetPlayerName: function() {
        var name = FBInstant.player.getName();
        if (name == null) {
            name = "";
        }
        return Utils.manageString("playerName", name);
    },

    FBInstant_PlatformGetPlayerId: function() {
        var id = FBInstant.player.getID();
        if (id == null) {
            id = "";
        }
        return Utils.manageString("playerID", id);
    },

    FBInstant_PlatformGetPlayerLocale: function() {
        var locale = FBInstant.getLocale();
        if (locale == null) {
            locale = "";
        }
        return Utils.manageString("playerLocale", locale);
    },

    FBInstant_PlatformGetPlayerPhoto: function() {
        var photo = FBInstant.player.getPhoto();
        if (photo == null) {
            photo = "";
        }
        return Utils.manageString("playerPhoto", photo);
    },


    // =====================================
    // CanSubscribeBotAsync
    // =====================================
    FBInstant_PlatformCanSubscribeBotAsync: function(callback) {
        FBInstant.player.canSubscribeBotAsync().then(function(canSubscribe) {
            if (canSubscribe) {
                Runtime.dynCall("vi", callback, [1]);
            }
            else {
                Runtime.dynCall("vi", callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformCanSubscribeBotAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // SubscribeBotAsync
    // =====================================
    FBInstant_PlatformSubscribeBotAsync: function(callback) {
        FBInstant.player.subscribeBotAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSubscribeBotAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // GetEntryPointData
    // =====================================
    FBInstant_PlatformGetEntryPointData: function() {
        var entryPointData = FBInstant.getEntryPointData();
        if (entryPointData) {
            return Utils.manageString("entryPointData", JSON.stringify(entryPointData));
        }
        else {
            return null;
        }
    },


    // =====================================
    // GetEntryPoint
    // =====================================
    FBInstant_PlatformGetEntryPointAsync: function(callback) {
        FBInstant.getEntryPointAsync().then(function(entrypoint) {
            Utils.dynCall(callback, [entrypoint]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetEntryPoint - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // ChooseContextAsync
    // =====================================
    FBInstant_PlatformChooseContextAsync: function(callback, coptionsJson) {
        var optionsJson = Pointer_stringify(coptionsJson);
        var options = optionsJson != "" ? JSON.parse(optionsJson) : null;
        FBInstant.context.chooseAsync(options).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            Utils.dynCall(callback, [ctxId, ctxType]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformChooseContextAsync - error: " + err.message);
            Runtime.dynCall("vii", callback, [0,0]);
        });
    },


    // =====================================
    // CreateContextAsync
    // =====================================
    FBInstant_PlatformCreateContextAsync: function(callback, cplayerId) {
        var playerId = Pointer_stringify(cplayerId);
        FBInstant.context.createAsync(playerId).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            Utils.dynCall(callback, [ctxId, ctxType]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCreateContextAsync - error: " + err.message);
            Runtime.dynCall("vii", callback, [0,0]);
        });
    },


    // =====================================
    // SwitchContextAsync
    // =====================================
    FBInstant_PlatformSwitchContextAsync: function(callback, ccontextId) {
        var contextId = Pointer_stringify(ccontextId);
        FBInstant.context.createAsync(contextId).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            Utils.dynCall(callback, [ctxId, ctxType]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSwitchContextAsync - error: " + err.message);
            Runtime.dynCall("vii", callback, [0,0]);
        });
    },


    // =====================================
    // GetContextId/Type
    // =====================================
    FBInstant_PlatformGetContextID: function() {
        var id = FBInstant.context.getID();
        if (id == null) {
            return;
        }
        return Utils.manageString("contextId", id);
    },

    FBInstant_PlatformGetContextType: function() {
        var type = FBInstant.context.getType();
        if (type == null) {
            return;
        }
        return Utils.manageString("contextType", type);
    },


    // =====================================
    // GetPlayersInContext
    // =====================================
    FBInstant_PlatformGetPlayersInContextAsync: function(callback) {
        FBInstant.context.getPlayersAsync().then(function(players) {
            Context.setPlayers(players);
            Runtime.dynCall("vi", callback, [ players.length ]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetPlayersInContextAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [ 0 ]);
        });
    },
    FBInstant_PlatformGetPlayerIdInContext: function(index) {
        var player = Context.players[index];
        if (player != null) {
            return player.id;
        }
    },
    FBInstant_PlatformGetPlayerNameInContext: function(index) {
        var player = Context.players[index];
        if (player != null) {
            return player.name;
        }
    },
    FBInstant_PlatformGetPlayerPhotoInContext: function(index) {
        var player = Context.players[index];
        if (player != null) {
            return player.photo;
        }
    },


    // =====================================
    // GetPlatform
    // =====================================
    FBInstant_PlatformGetPlatform: function() {
        var platform = FBInstant.getPlatform();
        if (platform) {
            return Utils.manageString("platform", platform);
        }
        else {
            return null;
        }
    },


    // =====================================
    // GetLocale
    // =====================================
    FBInstant_PlatformGetLocale: function() {
        var locale = FBInstant.getLocale();
        if (locale) {
            return Utils.manageString("locale", locale);
        }
        else {
            return null;
        }
    },


    // =====================================
    // GetSupportedAPIs
    // =====================================
    FBInstant_PlatformGetSupportedAPIs: function() {
        var supportedAPIs = FBInstant.getSupportedAPIs();
        if (supportedAPIs) {
            var apis = {};
            for (var i=0; i<supportedAPIs.length; i++) {
                var api = supportedAPIs[i];
                apis[api] = true;
            }
            return Utils.manageString("supportedAPIs", JSON.stringify(apis));
        }
        else {
            return null;
        }
    },


    // =====================================
    // GetSDKVersion
    // =====================================
    FBInstant_PlatformGetSDKVersion: function() {
        var sdkVersion = FBInstant.getSDKVersion();
        if (sdkVersion) {
            return Utils.manageString("sdkVersion", sdkVersion);
        }
        else {
            return null;
        }
    },


    // =====================================
    // CanCreateShortcutAsync
    // =====================================
    FBInstant_PlatformCanCreateShortcutAsync: function(callback) {
        FBInstant.canCreateShortcutAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCanCreateShortcutAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // CreateShortcutAsync
    // =====================================
    FBInstant_PlatformCreateShortcutAsync: function(callback) {
        FBInstant.createShortcutAsync().then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCreateShortcutAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // LogEvent
    // =====================================
    FBInstant_PlatformLogEvent: function(ceventName, valueToSum, cparametersJson) {
        var eventName = Pointer_stringify(ceventName);
        var parametersJson = Pointer_stringify(cparametersJson);
        var parameters = JSON.parse(parametersJson);
        var logged = FBInstant.logEvent(eventName, valueToSum, parameters);
        if (logged != null) {
            console.log("FBInstant_PlatformLogEvent - error: " + String(logged.code) + " " + String(logged.message));
        }
    },



    // =====================================
    // IsSizeBetween
    // =====================================
    FBInstant_PlatformIsSizeBetween: function(min, max) {
        var result = FBInstant.context.isSizeBetween(min, max);
        return result ? result.answer : false;
    },


    // =====================================
    // ShareAsync
    // =====================================
    FBInstant_PlatformShareAsync: function(callback, cpayloadJson) {
        var payloadJson = Pointer_stringify(cpayloadJson);
        var payload = JSON.parse(payloadJson);
        FBInstant.shareAsync(payload).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShareAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // CreateStoreAsync
    // =====================================
    FBInstant_PlatformCreateStoreAsync: function(callback, cstoreName) {
        var storeName = Pointer_stringify(cstoreName);
        FBInstant.context.createStoreAsync(storeName).then(function(store) {
            var storeId = store.getID();
            Utils.dynCall(callback, [storeId]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCreateStoreAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // CloseStoreAsync
    // =====================================
    FBInstant_PlatformCloseStoreAsync: function(callback, cstoreName) {
        var storeName = Pointer_stringify(cstoreName);
        FBInstant.context.getStoresAsync({}).then(function(stores) {
            var store = stores.find(function(store) { return store.getName() == storeName; });
            if (store) {
                store.endAsync().then(function() {
                    Runtime.dynCall("vi", callback, [1]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformCloseStoreAsync - error: " + err.message);
                    Runtime.dynCall("vi", callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformCloseStoreAsync - unable to find store");
                Runtime.dynCall("vi", callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformCloseStoreAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // GetStoreDataAsync
    // =====================================
    FBInstant_PlatformGetStoreDataAsync: function(callback, cstoreName, ckeysJson) {
        var storeName = Pointer_stringify(cstoreName);
        var keysJson = Pointer_stringify(ckeysJson);
        var keys = JSON.parse(keysJson);
        FBInstant.context.getStoresAsync({}).then(function(stores) {
            var store = stores.find(function(store) { return store.getName() == storeName; });
            if (store) {
                store.getDataAsync(keys).then(function(data) {
                    Utils.dynCall(callback, [JSON.stringify(data)]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformGetStoreDataAsync - getDataAsync - error: " + err.message);
                    Runtime.dynCall("vi", callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformGetStoreDataAsync - unable to find store");
                Runtime.dynCall("vi", callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetStoreDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // IncrementStoreDataAsync
    // =====================================
    FBInstant_PlatformIncrementStoreDataAsync: function(callback, cstoreName, cincrementsJson) {
        var storeName = Pointer_stringify(cstoreName);
        var incrementsJson = Pointer_stringify(cincrementsJson);
        var increments = JSON.parse(incrementsJson);
        FBInstant.context.getStoresAsync({}).then(function(stores) {
            var store = stores.find(function(store) { return store.getName() == storeName; });
            if (store) {
                store.incrementDataAsync(increments).then(function(data) {
                    Utils.dynCall(callback, [data]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformIncrementStoreDataAsync - incrementDataAsync - error: " + err.message);
                    Runtime.dynCall("vi", callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformIncrementStoreDataAsync - unable to find store");
                Runtime.dynCall("vi", callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformIncrementStoreDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },

    // =====================================
    // GetStoresAsync
    // =====================================
    FBInstant_PlatformGetStoresAsync: function(callback) {
        FBInstant.context.getStoresAsync({}).then(function(stores) {
            var results = [];
            stores.map(function(store) {
                results.push({
                    id: store.getID(),
                    name: store.getName(),
                    status: store.getStatus(),
                    context_id: store.getContextID()
                });
            });
            var storesJson = JSON.stringify(results);
            Utils.dynCall(callback, [storesJson]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetStoresAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // SaveStoreDataAsync
    // =====================================
    FBInstant_PlatformSaveStoreDataAsync: function(callback, cstoreName, cdataJson) {
        var storeName = Pointer_stringify(cstoreName);
        var dataJson = Pointer_stringify(cdataJson);
        var data = JSON.parse(dataJson);
        FBInstant.context.getStoresAsync({ status: "ACTIVE" }).then(function(stores) {
            var store = stores.find(function(store) { return store.getName() == storeName; });
            if(store) {
                store.saveDataAsync(data).then(function() {
                    Runtime.dynCall("vi", callback, [1]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformSaveStoreDataAsync - saveDataAsync - error: " + err.message);
                    Runtime.dynCall("vi", callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformSaveStoreDataAsync - unable to find store");
                Runtime.dynCall("vi", callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformSaveStoreDataAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },

    // =====================================
    // Interstitial Ads
    // =====================================
    FBInstant_PlatformGetInterstitialAdAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        FBInstant.getInterstitialAdAsync(placementId).then(function(interstitial) {
            var id = Ads.insert(placementId, interstitial);
            Utils.dynCall(callback, [id, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetInterstitialAdAsync - error: " + err.message);
            Utils.dynCall(callback, [1, err.code]);
        });
    },
    FBInstant_PlatformLoadInterstitialAdAsync: function(callback, cid) {
        var id = Pointer_stringify(cid);
        var adInstance = Ads.find(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - unable to find ad with id: " + id);
            Utils.dynCall(callback, [1, "INVALID_PARAM"]);
            return;
        }
        adInstance.loadAsync().then(function() {
            Runtime.dynCall("vii", callback, [1, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - error: " + err.message);
            Utils.dynCall(callback, [0, err.code]);
        });
    },
    FBInstant_PlatformShowInterstitialAdAsync: function(callback, cid) {
        var id = Pointer_stringify(cid);
        var adInstance = Ads.remove(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformShowInterstitialAdAsync - unable to find ad with id: " + id);
            Utils.dynCall(callback, [1, "INVALID_PARAM"]);
            return;
        }
        adInstance.showAsync().then(function() {
            Runtime.dynCall("vii", callback, [1, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShowInterstitialAdAsync - error: " + err.message);
            Utils.dynCall(callback, [0, err.code]);
        });
    },



    // =====================================
    // Rewarded Ads
    // =====================================
    FBInstant_PlatformGetRewardedVideoAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        FBInstant.getRewardedVideoAsync(placementId).then(function(rewarded) {
            var id = Ads.insert(placementId, rewarded);
            Utils.dynCall(callback, [id, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetRewardedVideoAsync - error: " + err.message);
            Utils.dynCall(callback, [1, err.code]);
        });
    },
    FBInstant_PlatformLoadRewardedVideoAsync: function(callback, cid) {
        var id = Pointer_stringify(cid);
        var adInstance = Ads.find(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformLoadRewardedVideoAsync - unable to find ad with id: " + id);
            Utils.dynCall(callback, [1, "INVALID_PARAM"]);
            return;
        }
        adInstance.loadAsync().then(function() {
            Runtime.dynCall("vii", callback, [1, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadRewardedVideoAsync - error: " + err.message);
            Utils.dynCall(callback, [0, err.code]);
        });
    },
    FBInstant_PlatformShowRewardedVideoAsync: function(callback, cid) {
        var id = Pointer_stringify(cid);
        var adInstance = Ads.remove(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformShowRewardedVideoAsync - unable to find ad with id: " + id);
            Utils.dynCall(callback, [1, "INVALID_PARAM"]);
            return;
        }
        adInstance.showAsync().then(function() {
            Runtime.dynCall("vii", callback, [1, 0]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShowRewardedVideoAsync - error: " + err.message);
            Utils.dynCall(callback, [0, err.code]);
        });
    },


    // =====================================
    // Leaderboard
    // =====================================
    FBInstant_PlatformGetLeaderboardAsync: function(callback, cname) {
        var name = Pointer_stringify(cname);
        var contextId;
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            contextId = leaderboard.getContextID();
            return leaderboard.getEntryCountAsync();
        }).then(function(count) {
            Utils.dynCall(callback, [contextId, count]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformSetLeaderboardScoreAsync: function(callback, cname, score, cextraData) {
        var name = Pointer_stringify(cname);
        var extraData = Pointer_stringify(cextraData);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.setScoreAsync(score, extraData);
        }).then(function(entry) {
            Utils.dynCall(callback, [entry.getScore(), entry.getExtraData()]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetLeaderboardScoreAsync - error: " + err.message);
            Runtime.dynCall("vii", callback, [0,0]);
        });
    },
    FBInstant_PlatformGetLeaderboardScoreAsync: function(callback, cname) {
        var name = Pointer_stringify(cname);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.getPlayerEntryAsync();
        }).then(function(entry) {
            Utils.dynCall(callback, [entry.getRank(), entry.getScore(), entry.getExtraData()]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardScoreAsync - error: " + err.message);
            Runtime.dynCall("viii", callback, [0,0,0]);
        });
    },
    FBInstant_PlatformGetLeaderboardEntriesAsync: function(callback, cname, count, offset) {
        var name = Pointer_stringify(cname);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.getEntriesAsync(count, offset);
        }).then(function(entries) {
            var entriesData = [];
            for(var i=0; i<entries.length; i++) {
                var entry = entries[i];
                entriesData.push({
                    rank: entry.getRank(),
                    score: entry.getScore(),
                    formatted_score: entry.getFormattedScore(),
                    timestamp: entry.getTimestamp(),
                    extra_data: entry.getExtraData(),
                    player_name: entry.getPlayer().getName(),
                    player_id: entry.getPlayer().getID(),
                    player_photo: entry.getPlayer().getPhoto(),
                });
            }
            Utils.dynCall(callback, [JSON.stringify(entriesData)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardEntriesAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },
    FBInstant_PlatformGetLeaderboardConnectedPlayerEntriesAsync: function(callback, cname, count, offset) {
        var name = Pointer_stringify(cname);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.getConnectedPlayerEntriesAsync(count, offset);
        }).then(function(entries) {
            var entriesData = [];
            for(var i=0; i<entries.length; i++) {
                var entry = entries[i];
                entriesData.push({
                    rank: entry.getRank(),
                    score: entry.getScore(),
                    formatted_score: entry.getFormattedScore(),
                    timestamp: entry.getTimestamp(),
                    extra_data: entry.getExtraData(),
                    player_name: entry.getPlayer().getName(),
                    player_id: entry.getPlayer().getID(),
                    player_photo: entry.getPlayer().getPhoto(),
                });
            }
            Utils.dynCall(callback, [JSON.stringify(entriesData)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardConnectedPlayerEntriesAsync - error", err);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // OnPaymentsReady
    // =====================================
    FBInstant_PlatformOnPaymentsReady: function(callback) {
        FBInstant.payments.onReady(function() {
            Runtime.dynCall("v", callback, []);
        });
    },


    // =====================================
    // GetCatalogAsync
    // =====================================
    FBInstant_PlatformGetProductCatalogAsync: function(callback) {
        FBInstant.payments.getCatalogAsync().then(function(catalog) {
            var products = [];
            for(var i=0; i<catalog.length; i++) {
                var product = catalog[i];
                products.push({
                    title: product.title,
                    product_id: product.productID,
                    description: product.description,
                    image_uri: product.imageURI,
                    price: product.price,
                    price_currency_code: product.priceCurrencyCode,
                });
            }
            Utils.dynCall(callback, [JSON.stringify(products)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetProductCatalogAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },



    // =====================================
    // PurchaseAsync
    // =====================================
    FBInstant_PlatformPurchaseAsync: function(callback, cproductId, cdeveloperPayload) {
        var purchaseConfig = {
            productID: Pointer_stringify(cproductId),
            developerPayload: Pointer_stringify(cdeveloperPayload),
        };
        FBInstant.payments.purchaseAsync(purchaseConfig).then(function(purchase) {
            var result = Utils.convertPurchase(purchase);
            Utils.dynCall(callback, [JSON.stringify(result)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformPurchaseAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },




    // =====================================
    // GetPurchasesAsync
    // =====================================
    FBInstant_PlatformGetPurchasesAsync: function(callback) {
        FBInstant.payments.getPurchasesAsync().then(function(purchases) {
            var result = [];
            for(var i=0; i<purchases.length; i++) {
                var purchase = purchases[i];
                result.push(Utils.convertPurchase(purchase));
            }
            Utils.dynCall(callback, [JSON.stringify(result)]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformPurchaseAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },



    // =====================================
    // ConsumePurchaseAsync
    // =====================================
    FBInstant_PlatformConsumePurchaseAsync: function(callback, cpurchaseToken) {
        var purchaseToken = Pointer_stringify(cpurchaseToken);
        FBInstant.payments.consumePurchaseAsync(purchaseToken).then(function() {
            Runtime.dynCall("vi", callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformConsumePurchaseAsync - error: " + err.message);
            Runtime.dynCall("vi", callback, [0]);
        });
    },


    // =====================================
    // PostSessionScore
    // =====================================
    FBInstant_PlatformPostSessionScore: function(score) {
        FBInstant.postSessionScore(score);
    },

};

autoAddDeps(FBInstantLibrary, "$Context");
autoAddDeps(FBInstantLibrary, "$Utils");
autoAddDeps(FBInstantLibrary, "$Ads");

mergeInto(LibraryManager.library, FBInstantLibrary);
