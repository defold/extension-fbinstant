// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var FBInstantLibrary = {

    $Context: {
        players: [],
        setPlayers: function(players_to_set) {
            // remove old players and free allocations
            while (Context.players.length > 0) {
                var player = Context.players.pop();
                Module._free(player.id);
                Module._free(player.name);
                Module._free(player.photo);
            }
            // create new player objects with allocated strings
            for (var i=0; i<players_to_set.length; i++) {
                var player = players_to_set[i];
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
        storeString: function(key, value) {
            if (Utils.strings[key] != null) {
                Module._free(Utils.strings[key].ptr);
            }
            Utils.strings[key] = {
                ptr: Utils.allocateString(value),
                str: value
            }
            return Utils.strings[key].ptr;
        },
        allocateString: function(str) {
            return allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL)
        },
        dynCall: function(fn, in_args) {
            var signature = "v";
            var out_args = [];
            for (var i=0; i < in_args.length; i++) {
                signature = signature + "i";
                out_args.push((typeof in_args[i] == "string") ? Utils.allocateString(in_args[i]) : in_args[i]);
            }
            Runtime.dynCall(signature, fn, out_args.slice());
            for (var i=0; i < in_args.length; i++) {
                if (typeof in_args[i] == "string") Module._free(out_args[i]);
            }
        },
    },

    $Interstitials: {
        ads: [],
    },


    // =====================================
    // InitializeAsync
    // =====================================
    FBInstant_PlatformInitializeAsync: function(callback) {
        FBInstant.initializeAsync().then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformInitializeAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },


    // =====================================
    // UpdateAsync
    // =====================================
    FBInstant_PlatformUpdateAsync: function(callback, cpayloadjson) {
        var payloadjson = Pointer_stringify(cpayloadjson);
        var payload = JSON.parse(payloadjson)
        FBInstant.updateAsync(payload).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformUpdateAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },


    // =====================================
    // Get/Set/Flush PlayerData
    // =====================================
    FBInstant_PlatformGetPlayerDataAsync: function(callback, ckey) {
        var key = Pointer_stringify(ckey);
        FBInstant.player.getDataAsync([key]).then(function(data) {
            if (typeof data[key] !== 'undefined') {
                Utils.dynCall(callback, [data[key].toString()]);
            }
            else {
                Runtime.dynCall('vi', callback, [0]);
            }
        }).catch(function(err) {
            console.log('FBInstant_PlatformGetDataAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformSetPlayerDataAsync: function(callback, cdatajson) {
        var datajson = Pointer_stringify(cdatajson);
        var data = JSON.parse(datajson);
        FBInstant.player.setDataAsync(data).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformSetPlayerDataAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformFlushPlayerDataAsync: function(callback) {
        FBInstant.player.flushDataAsync().then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformFlushPlayerDataAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
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
            console.log('FBInstant_PlatformGetPlayerStatsAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformSetPlayerStatsAsync: function(callback, cjson) {
        var json = Pointer_stringify(cjson);
        var stats = JSON.parse(json);
        FBInstant.player.setStatsAsync(stats).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformSetPlayerStatsAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformIncrementPlayerStatsAsync: function(callback, cjson) {
        var json = Pointer_stringify(cjson);
        var increments = JSON.parse(json);
        FBInstant.player.incrementStatsAsync(increments).then(function(stats) {
            Utils.dynCall(callback, [JSON.stringify(stats)]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformIncrementPlayerStatsAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
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
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformStartGameAsync - error', err);
            Runtime.dynCall('vi', callback, [0]);
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
        return Utils.storeString("playerName", name);
    },

    FBInstant_PlatformGetPlayerId: function() {
        var id = FBInstant.player.getID();
        if (id == null) {
            id = "";
        }
        return Utils.storeString("playerID", id);
    },

    FBInstant_PlatformGetPlayerLocale: function() {
        var locale = FBInstant.getLocale();
        if (locale == null) {
            locale = "";
        }
        return Utils.storeString("playerLocale", locale);
    },

    FBInstant_PlatformGetPlayerPhoto: function() {
        var photo = FBInstant.player.getPhoto();
        if (photo == null) {
            photo = "";
        }
        return Utils.storeString("playerPhoto", photo);
    },


    // =====================================
    // GetEntryPointData
    // =====================================
    FBInstant_PlatformGetEntryPointData: function() {
        var entryPointData = FBInstant.getEntryPointData();
        if (entryPointData) {
            return Utils.storeString("entryPointData", JSON.stringify(entryPointData));
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
            console.log('FBInstant_PlatformGetEntryPoint - error', err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },


    // =====================================
    // ChooseContextAsync
    // =====================================
    FBInstant_PlatformChooseContextAsync: function(callback, coptionsJson) {
        var optionsJson = Pointer_stringify(coptionsJson);
        var options = optionsJson != "" ? JSON.parse(optionsJson) : null;
        console.log("FBInstant_PlatformChooseContextAsync", optionsJson, options);
        FBInstant.context.chooseAsync(options).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            Utils.dynCall(callback, [ctxId, ctxType]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformChooseContextAsync - error', err);
            Runtime.dynCall('vii', callback, [0,0]);
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
            console.log('FBInstant_PlatformCreateContextAsync - error', err);
            Runtime.dynCall('vii', callback, [0,0]);
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
            console.log('FBInstant_PlatformSwitchContextAsync - error', err);
            Runtime.dynCall('vii', callback, [0,0]);
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
        return Utils.storeString("contextId", id);
    },

    FBInstant_PlatformGetContextType: function() {
        var type = FBInstant.context.getType();
        if (type == null) {
            return;
        }
        return Utils.storeString("contextType", type);
    },


    // =====================================
    // GetPlayersInContext
    // =====================================
    FBInstant_PlatformGetPlayersInContextAsync: function(callback) {
        FBInstant.context.getPlayersAsync().then(function(players) {
            Context.setPlayers(players);
            Runtime.dynCall('vi', callback, [ players.length ]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformGetPlayersInContextAsync - error', err);
            Runtime.dynCall('vi', callback, [ 0 ]);
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
    // LogEvent
    // =====================================
    FBInstant_PlatformLogEvent: function(ceventName, valueToSum, cparametersJson) {
        var eventName = Pointer_stringify(ceventName);
        var parametersJson = Pointer_stringify(cparametersJson);
        var parameters = JSON.parse(parametersJson);
        var logged = FBInstant.logEvent(eventName, valueToSum, parameters);
        if (logged != null) {
            console.log("FBInstant_PlatformLogEvent - error", logged.code, logged.message);
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
        console.log("FBInstant_PlatformShareAsync - payload", payload);
        FBInstant.shareAsync(payload).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShareAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
            console.log("FBInstant_PlatformCreateStoreAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
                    Runtime.dynCall('vi', callback, [1]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformCloseStoreAsync - error", err);
                    Runtime.dynCall('vi', callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformCloseStoreAsync - unable to find store");
                Runtime.dynCall('vi', callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformCloseStoreAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
                    console.log("FBInstant_PlatformGetStoreDataAsync - getDataAsync - error", err);
                    Runtime.dynCall('vi', callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformGetStoreDataAsync - unable to find store");
                Runtime.dynCall('vi', callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetStoreDataAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
                    console.log("FBInstant_PlatformIncrementStoreDataAsync - incrementDataAsync - error", err);
                    Runtime.dynCall('vi', callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformIncrementStoreDataAsync - unable to find store");
                Runtime.dynCall('vi', callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformIncrementStoreDataAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
            console.log("FBInstant_PlatformGetStoresAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
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
                    Runtime.dynCall('vi', callback, [1]);
                }).catch(function(err) {
                    console.log("FBInstant_PlatformSaveStoreDataAsync - saveDataAsync - error", err);
                    Runtime.dynCall('vi', callback, [0]);
                });
            }
            else {
                console.log("FBInstant_PlatformSaveStoreDataAsync - unable to find store");
                Runtime.dynCall('vi', callback, [0]);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformSaveStoreDataAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },



    FBInstant_PlatformLoadInterstitialAdAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        FBInstant.getInterstitialAdAsync(placementId).then(function(interstitial) {
            Interstitials.ads.push(interstitial);
            return interstitial.loadAsync();
        }).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformShowInterstitialAdAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        var interstitial = Interstitials.ads.find(function(ad) { return ad.getPlacementID() == placementId; });
        if (interstitial) {
            interstitial.showAsync().then(function() {
                Runtime.dynCall('vi', callback, [1]);
            }).catch(function(err) {
                console.log("FBInstant_PlatformShowInterstitialAdAsync - error", err);
                Runtime.dynCall('vi', callback, [0]);
            });
        }
        else {
            console.log("FBInstant_PlatformShowInterstitialAdAsync - unable to find ad. Did you load it?");
            Runtime.dynCall('vi', callback, [0]);
        }
    },
}

autoAddDeps(FBInstantLibrary, '$Context');
autoAddDeps(FBInstantLibrary, '$Utils');
autoAddDeps(FBInstantLibrary, '$Interstitials');

mergeInto(LibraryManager.library, FBInstantLibrary);
