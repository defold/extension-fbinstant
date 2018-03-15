// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var FBInstantLibrary = {

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
                Runtime.dynCall('vi', callback, [allocate(intArrayFromString(data[key].toString()), 'i8', ALLOC_NORMAL)]);
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
    FBInstant_PlatformGetPlayerStatsAsync: function(callback, ckey) {
        var key = Pointer_stringify(ckey);
        FBInstant.player.getStatsAsync([key]).then(function(stats) {
            if (typeof stats[key] !== 'undefined') {
                Runtime.dynCall('vi', callback, [stats[key]]);
            }
            else {
                Runtime.dynCall('vi', callback, [0]);
            }
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
            Runtime.dynCall('vi', callback, [allocate(intArrayFromString(JSON.stringify(stats)), 'i8', ALLOC_NORMAL)]);
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
        return allocate(intArrayFromString(name), 'i8', ALLOC_NORMAL)
    },

    FBInstant_PlatformGetPlayerId: function() {
        var id = FBInstant.player.getID();
        if (id == null) {
            id = "";
        }
        return allocate(intArrayFromString(id), 'i8', ALLOC_NORMAL)
    },

    FBInstant_PlatformGetPlayerLocale: function() {
        var locale = FBInstant.getLocale();
        if (locale == null) {
            locale = "";
        }
        return allocate(intArrayFromString(locale), 'i8', ALLOC_NORMAL)
    },

    FBInstant_PlatformGetPlayerPhoto: function() {
        var photo = FBInstant.player.getPhoto();
        if (photo == null) {
            photo = "";
        }
        return allocate(intArrayFromString(photo), 'i8', ALLOC_NORMAL)
    },


    // =====================================
    // GetEntryPointData
    // =====================================
    FBInstant_PlatformGetEntryPointData: function() {
        var entryPointData = FBInstant.getEntryPointData();
        if (entryPointData) {
            return allocate(intArrayFromString(JSON.stringify(entryPointData)), 'i8', ALLOC_NORMAL);
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
            Runtime.dynCall('vi', callback, [allocate(intArrayFromString(entrypoint), 'i8', ALLOC_NORMAL)]);
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
        FBInstant.context.chooseAsync(options).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            Runtime.dynCall('vii', callback, [
                allocate(intArrayFromString(ctxId), 'i8', ALLOC_NORMAL),
                allocate(intArrayFromString(ctxType), 'i8', ALLOC_NORMAL)
            ]);
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
            Runtime.dynCall('vii', callback, [
                allocate(intArrayFromString(ctxId), 'i8', ALLOC_NORMAL),
                allocate(intArrayFromString(ctxType), 'i8', ALLOC_NORMAL)
            ]);
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
            Runtime.dynCall('vii', callback, [
                allocate(intArrayFromString(ctxId), 'i8', ALLOC_NORMAL),
                allocate(intArrayFromString(ctxType), 'i8', ALLOC_NORMAL)
            ]);
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
        return allocate(intArrayFromString(id), 'i8', ALLOC_NORMAL)
    },

    FBInstant_PlatformGetContextType: function() {
        var type = FBInstant.context.getType();
        if (type == null) {
            return;
        }
        return allocate(intArrayFromString(type), 'i8', ALLOC_NORMAL)
    },


    // =====================================
    // GetPlayersInContext
    // =====================================
    playersInContext: {},
    FBInstant_PlatformGetPlayersInContextAsync__deps: [ 'playersInContext' ],
    FBInstant_PlatformGetPlayersInContextAsync: function(callback) {
        FBInstant.context.getPlayersAsync().then(function(players) {
            var ctxId = FBInstant.context.getID();
            _playersInContext = players;
            Runtime.dynCall('vi', callback, [ players.length ]);
        }).catch(function(err) {
            console.log('FBInstant_PlatformGetPlayersInContextAsync - error', err);
            Runtime.dynCall('vi', callback, [ 0 ]);
        });
    },
    FBInstant_PlatformGetPlayerIdInContext__deps: [ 'playersInContext' ],
    FBInstant_PlatformGetPlayerIdInContext: function(index) {
        var player = _playersInContext[index];
        if (player != null) {
            return allocate(intArrayFromString(player.getID()), 'i8', ALLOC_NORMAL);
        }
        return "";
    },
    FBInstant_PlatformGetPlayerNameInContext__deps: [ 'playersInContext' ],
    FBInstant_PlatformGetPlayerNameInContext: function(index) {
        var player = _playersInContext[index];
        if (player != null) {
            return allocate(intArrayFromString(player.getName()), 'i8', ALLOC_NORMAL);
        }
        return "";
    },
    FBInstant_PlatformGetPlayerPhotoInContext__deps: [ 'playersInContext' ],
    FBInstant_PlatformGetPlayerPhotoInContext: function(index) {
        var player = _playersInContext[index];
        if (player != null) {
            return allocate(intArrayFromString(player.getPhoto()), 'i8', ALLOC_NORMAL);
        }
        return "";
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
        // var canvas = document.getElementById("canvas");
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
            Runtime.dynCall('vi', callback, [allocate(intArrayFromString(storeId), 'i8', ALLOC_NORMAL)]);
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
            if(store) {
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
            if(store) {
                store.getDataAsync(keys).then(function(data) {
                    Runtime.dynCall('vi', callback, [allocate(intArrayFromString(JSON.stringify(data)), 'i8', ALLOC_NORMAL)]);
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
            if(store) {
                store.incrementDataAsync(increments).then(function(data) {
                    Runtime.dynCall('vi', callback, [allocate(intArrayFromString(JSON.stringify(data)), 'i8', ALLOC_NORMAL)]);
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
            Runtime.dynCall('vi', callback, [allocate(intArrayFromString(storesJson), 'i8', ALLOC_NORMAL)]);
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





    interstitialAds: [],
    FBInstant_PlatformLoadInterstitialAdAsync__deps: [ 'interstitialAds' ],
    FBInstant_PlatformLoadInterstitialAdAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        var ad = null;
        FBInstant.getInterstitialAdAsync(placementId).then(function(interstitial) {
            ad = interstitial;
            _interstitialAds.push(interstitial);
            return interstitial.loadAsync();
        }).then(function() {
            Runtime.dynCall('vi', callback, [1]);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - error", err);
            Runtime.dynCall('vi', callback, [0]);
        });
    },
    FBInstant_PlatformShowInterstitialAdAsync__deps: [ 'interstitialAds' ],
    FBInstant_PlatformShowInterstitialAdAsync: function(callback, cplacementId) {
        var placementId = Pointer_stringify(cplacementId);
        var ad = _interstitialAds.find(function(ad) { return ad.getPlacementID() == placementId; });
        if (ad) {
            ad.showAsync().then(function() {
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

mergeInto(LibraryManager.library, FBInstantLibrary);
