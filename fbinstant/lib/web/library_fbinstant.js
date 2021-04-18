// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var FBInstantLibrary = {

    $Context: {
        players: [],
        setPlayers: function(players_to_set) {
            Context.players = [];
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
        allocateString: function(str) {
            return allocate(intArrayFromString(str), "i8", ALLOC_STACK);
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
            {{{ makeDynCall("vi", "callback") }}} (1);
            return;
        }
        FBInstant.initializeAsync().then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformInitializeAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // UpdateAsync
    // =====================================
    FBInstant_PlatformUpdateAsync: function(callback, cpayloadjson) {
        var payloadjson =  UTF8ToString(cpayloadjson);
        var payload = JSON.parse(payloadjson);
        FBInstant.updateAsync(payload).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformUpdateAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // GetSignedPlayerInfoAsync
    // =====================================
    FBInstant_PlatformGetSignedPlayerInfoAsync: function(callback, cpayload) {
        var payload =  UTF8ToString(cpayload);
        FBInstant.player.getSignedPlayerInfoAsync(payload).then(function(result) {
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(result.getSignature()));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetSignedPlayerInfoAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // Get/Set/Flush PlayerData
    // =====================================
    FBInstant_PlatformGetPlayerDataAsync: function(callback, ckeysjson) {
        var keysJson =  UTF8ToString(ckeysjson);
        var keys = JSON.parse(keysJson);
        FBInstant.player.getDataAsync(keys).then(function(data) {
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(data)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetDataAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },
    FBInstant_PlatformSetPlayerDataAsync: function(callback, cdatajson) {
        var datajson =  UTF8ToString(cdatajson);
        var data = JSON.parse(datajson);
        FBInstant.player.setDataAsync(data).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetPlayerDataAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },
    FBInstant_PlatformFlushPlayerDataAsync: function(callback) {
        FBInstant.player.flushDataAsync().then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformFlushPlayerDataAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // Get/Set/Increment PlayerStats
    // =====================================
    FBInstant_PlatformGetPlayerStatsAsync: function(callback, ckeysjson) {
        var keysJson =  UTF8ToString(ckeysjson);
        var keys = keysJson != "" ? JSON.parse(keysJson) : null;
        FBInstant.player.getStatsAsync(keys).then(function(stats) {
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(stats)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetPlayerStatsAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },
    FBInstant_PlatformSetPlayerStatsAsync: function(callback, cjson) {
        var json =  UTF8ToString(cjson);
        var stats = JSON.parse(json);
        FBInstant.player.setStatsAsync(stats).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetPlayerStatsAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },
    FBInstant_PlatformIncrementPlayerStatsAsync: function(callback, cjson) {
        var json =  UTF8ToString(cjson);
        var increments = JSON.parse(json);
        FBInstant.player.incrementStatsAsync(increments).then(function(stats) {
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(stats)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformIncrementPlayerStatsAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
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
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(players)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetConnectedPlayersAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // SetSessionData
    // =====================================
    FBInstant_PlatformSetSessionData: function(cjson) {
        var json =  UTF8ToString(cjson);
        var sessionData = JSON.parse(json);
        FBInstant.setSessionData(sessionData);
    },


    // =====================================
    // StartGameAsync
    // =====================================
    FBInstant_PlatformStartGameAsync: function(callback) {
        FBInstant.startGameAsync().then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformStartGameAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // SwitchGameAsync
    // =====================================
    FBInstant_PlatformSwitchGameAsync: function(cappId, cdataJson, callback) {
        var appId =  UTF8ToString(cappId);
        var dataJson =  UTF8ToString(cdataJson);
        var data = dataJson != "" ? JSON.parse(dataJson) : null;
        FBInstant.switchGameAsync(appId, data).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSwitchGameAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // OnPause
    // =====================================
    FBInstant_PlatformOnPause: function(callback) {
        FBInstant.onPause(function() {
            {{{ makeDynCall("v", "callback") }}} ();
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
        return Utils.allocateString(name);
    },

    FBInstant_PlatformGetPlayerId: function() {
        var id = FBInstant.player.getID();
        if (id == null) {
            id = "";
        }
        return Utils.allocateString(id);
    },

    FBInstant_PlatformGetPlayerLocale: function() {
        var locale = FBInstant.getLocale();
        if (locale == null) {
            locale = "";
        }
        return Utils.allocateString(locale);
    },

    FBInstant_PlatformGetPlayerPhoto: function() {
        var photo = FBInstant.player.getPhoto();
        if (photo == null) {
            photo = "";
        }
        return Utils.allocateString(photo);
    },


    // =====================================
    // CanSubscribeBotAsync
    // =====================================
    FBInstant_PlatformCanSubscribeBotAsync: function(callback) {
        FBInstant.player.canSubscribeBotAsync().then(function(canSubscribe) {
            if (canSubscribe) {
                {{{ makeDynCall("vi", "callback") }}} (1);
            }
            else {
                {{{ makeDynCall("vi", "callback") }}} (0);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformCanSubscribeBotAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // SubscribeBotAsync
    // =====================================
    FBInstant_PlatformSubscribeBotAsync: function(callback) {
        FBInstant.player.subscribeBotAsync().then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformSubscribeBotAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // GetEntryPointData
    // =====================================
    FBInstant_PlatformGetEntryPointData: function() {
        var entryPointData = FBInstant.getEntryPointData();
        if (entryPointData) {
            return Utils.allocateString(JSON.stringify(entryPointData));
        }
        else {
            return null;
        }
    },


    // =====================================
    // GetEntryPoint
    // =====================================
    FBInstant_PlatformGetEntryPointAsync: function(callback) {
        console.log("FBInstant_PlatformGetEntryPointAsync");
        FBInstant.getEntryPointAsync().then(function(entrypoint) {
            console.log("entrypoint " + entrypoint);
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(entrypoint));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetEntryPoint - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // ChooseContextAsync
    // =====================================
    FBInstant_PlatformChooseContextAsync: function(callback, coptionsJson) {
        var optionsJson =  UTF8ToString(coptionsJson);
        var options = optionsJson != "" ? JSON.parse(optionsJson) : null;
        FBInstant.context.chooseAsync(options).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(ctxId), Utils.allocateString(ctxType));
        }).catch(function(err) {
            console.log("FBInstant_PlatformChooseContextAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0,0);
        });
    },


    // =====================================
    // CreateContextAsync
    // =====================================
    FBInstant_PlatformCreateContextAsync: function(callback, cplayerId) {
        var playerId =  UTF8ToString(cplayerId);
        FBInstant.context.createAsync(playerId).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(ctxId), Utils.allocateString(ctxType));
        }).catch(function(err) {
            console.log("FBInstant_PlatformCreateContextAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0,0);
        });
    },


    // =====================================
    // SwitchContextAsync
    // =====================================
    FBInstant_PlatformSwitchContextAsync: function(callback, ccontextId) {
        var contextId =  UTF8ToString(ccontextId);
        FBInstant.context.createAsync(contextId).then(function() {
            var ctxId = FBInstant.context.getID();
            var ctxType = FBInstant.context.getType();
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(ctxId), Utils.allocateString(ctxType));
        }).catch(function(err) {
            console.log("FBInstant_PlatformSwitchContextAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0,0);
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
        return Utils.allocateString(id);
    },

    FBInstant_PlatformGetContextType: function() {
        var type = FBInstant.context.getType();
        if (type == null) {
            return;
        }
        return Utils.allocateString(type);
    },


    // =====================================
    // GetPlayersInContext
    // =====================================
    FBInstant_PlatformGetPlayersInContextAsync: function(callback) {
        FBInstant.context.getPlayersAsync().then(function(players) {
            Context.setPlayers(players);
            {{{ makeDynCall("vi", "callback") }}} ( players.length );
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetPlayersInContextAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} ( 0 );
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
            return Utils.allocateString(platform);
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
            return Utils.allocateString(locale);
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
            return Utils.allocateString(JSON.stringify(apis));
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
            return Utils.allocateString(sdkVersion);
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
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCanCreateShortcutAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // CreateShortcutAsync
    // =====================================
    FBInstant_PlatformCreateShortcutAsync: function(callback) {
        FBInstant.createShortcutAsync().then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformCreateShortcutAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // LogEvent
    // =====================================
    FBInstant_PlatformLogEvent: function(ceventName, valueToSum, cparametersJson) {
        var eventName =  UTF8ToString(ceventName);
        var parametersJson =  UTF8ToString(cparametersJson);
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
        var payloadJson =  UTF8ToString(cpayloadJson);
        var payload = JSON.parse(payloadJson);
        FBInstant.shareAsync(payload).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShareAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // Interstitial Ads
    // =====================================
    FBInstant_PlatformGetInterstitialAdAsync: function(callback, cplacementId) {
        var placementId =  UTF8ToString(cplacementId);
        FBInstant.getInterstitialAdAsync(placementId).then(function(interstitial) {
            var id = Ads.insert(placementId, interstitial);
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(id), 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetInterstitialAdAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },
    FBInstant_PlatformLoadInterstitialAdAsync: function(callback, cid) {
        var id =  UTF8ToString(cid);
        var adInstance = Ads.find(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - unable to find ad with id: " + id);
            {{{ makeDynCall("vii", "callback") }}} (1, Utils.allocateString("INVALID_PARAM"));
            return;
        }
        adInstance.loadAsync().then(function() {
            {{{ makeDynCall("vii", "callback") }}} (1, 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadInterstitialAdAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },
    FBInstant_PlatformShowInterstitialAdAsync: function(callback, cid) {
        var id =  UTF8ToString(cid);
        var adInstance = Ads.remove(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformShowInterstitialAdAsync - unable to find ad with id: " + id);
            {{{ makeDynCall("vii", "callback") }}} (1, Utils.allocateString("INVALID_PARAM"));
            return;
        }
        adInstance.showAsync().then(function() {
            {{{ makeDynCall("vii", "callback") }}} (1, 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShowInterstitialAdAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },



    // =====================================
    // Rewarded Ads
    // =====================================
    FBInstant_PlatformGetRewardedVideoAsync: function(callback, cplacementId) {
        var placementId =  UTF8ToString(cplacementId);
        FBInstant.getRewardedVideoAsync(placementId).then(function(rewarded) {
            var id = Ads.insert(placementId, rewarded);
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(id), 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetRewardedVideoAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },
    FBInstant_PlatformLoadRewardedVideoAsync: function(callback, cid) {
        var id =  UTF8ToString(cid);
        var adInstance = Ads.find(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformLoadRewardedVideoAsync - unable to find ad with id: " + id);
            {{{ makeDynCall("vii", "callback") }}} (1, Utils.allocateString("INVALID_PARAM"));
            return;
        }
        adInstance.loadAsync().then(function() {
            {{{ makeDynCall("vii", "callback") }}} (1, 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformLoadRewardedVideoAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },
    FBInstant_PlatformShowRewardedVideoAsync: function(callback, cid) {
        var id =  UTF8ToString(cid);
        var adInstance = Ads.remove(id);
        if (!adInstance) {
            console.log("FBInstant_PlatformShowRewardedVideoAsync - unable to find ad with id: " + id);
            {{{ makeDynCall("vii", "callback") }}} (1, Utils.allocateString("INVALID_PARAM"));
            return;
        }
        adInstance.showAsync().then(function() {
            {{{ makeDynCall("vii", "callback") }}} (1, 0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformShowRewardedVideoAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },


    // =====================================
    // Leaderboard
    // =====================================
    FBInstant_PlatformGetLeaderboardAsync: function(callback, cname) {
        var name =  UTF8ToString(cname);
        var contextId;
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            contextId = leaderboard.getContextID();
            return leaderboard.getEntryCountAsync();
        }).then(function(count) {
            {{{ makeDynCall("vii", "callback") }}} (Utils.allocateString(contextId), count);
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, 0);
        });
    },
    FBInstant_PlatformSetLeaderboardScoreAsync: function(callback, cname, score, cextraData) {
        var name =  UTF8ToString(cname);
        var extraData =  UTF8ToString(cextraData);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.setScoreAsync(score, extraData);
        }).then(function(entry) {
            {{{ makeDynCall("vii", "callback") }}} (entry.getScore(), Utils.allocateString(entry.getExtraData()));
        }).catch(function(err) {
            console.log("FBInstant_PlatformSetLeaderboardScoreAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0,0);
        });
    },
    FBInstant_PlatformGetLeaderboardScoreAsync: function(callback, cname) {
        var name =  UTF8ToString(cname);
        FBInstant.getLeaderboardAsync(name).then(function(leaderboard) {
            return leaderboard.getPlayerEntryAsync();
        }).then(function(entry) {
            {{{ makeDynCall("viii", "callback") }}} (Utils.allocateString(entry.getRank()), entry.getScore(), Utils.allocateString(entry.getExtraData()));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardScoreAsync - error: " + err.message);
            {{{ makeDynCall("viii", "callback") }}} (0,0,0);
        });
    },
    FBInstant_PlatformGetLeaderboardEntriesAsync: function(callback, cname, count, offset) {
        var name =  UTF8ToString(cname);
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
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(entriesData)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardEntriesAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },
    FBInstant_PlatformGetLeaderboardConnectedPlayerEntriesAsync: function(callback, cname, count, offset) {
        var name =  UTF8ToString(cname);
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
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(entriesData)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetLeaderboardConnectedPlayerEntriesAsync - error", err);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // OnPaymentsReady
    // =====================================
    FBInstant_PlatformOnPaymentsReady: function(callback) {
        FBInstant.payments.onReady(function() {
            {{{ makeDynCall("v", "callback") }}} ();
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
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(products)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformGetProductCatalogAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },



    // =====================================
    // PurchaseAsync
    // =====================================
    FBInstant_PlatformPurchaseAsync: function(callback, cproductId, cdeveloperPayload) {
        var purchaseConfig = {
            productID:  UTF8ToString(cproductId),
            developerPayload:  UTF8ToString(cdeveloperPayload),
        };
        FBInstant.payments.purchaseAsync(purchaseConfig).then(function(purchase) {
            var result = Utils.convertPurchase(purchase);
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(result)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformPurchaseAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
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
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(JSON.stringify(result)));
        }).catch(function(err) {
            console.log("FBInstant_PlatformPurchaseAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },



    // =====================================
    // ConsumePurchaseAsync
    // =====================================
    FBInstant_PlatformConsumePurchaseAsync: function(callback, cpurchaseToken) {
        var purchaseToken =  UTF8ToString(cpurchaseToken);
        FBInstant.payments.consumePurchaseAsync(purchaseToken).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (1);
        }).catch(function(err) {
            console.log("FBInstant_PlatformConsumePurchaseAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (0);
        });
    },


    // =====================================
    // PostSessionScore
    // =====================================
    FBInstant_PlatformPostSessionScore: function(score) {
        FBInstant.postSessionScore(score);
    },

    // =====================================
    // MatchPlayerAsync
    // =====================================
    FBInstant_PlatformMatchPlayerAsync: function(callback, cmatchTag, cswitchContextWhenMatched, cofflineMatch) {
        var matchTag =  UTF8ToString(cmatchTag);
        if (matchTag == "") {
            matchTag = null;
        }
        var switchContextWhenMatched = cswitchContextWhenMatched == 1;
        var offlineMatch = cofflineMatch == 1;
        FBInstant.matchPlayerAsync(matchTag, switchContextWhenMatched, offlineMatch).then(function() {
            {{{ makeDynCall("vi", "callback") }}} (0);
        }).catch(function(err) {
            console.log("FBInstant_PlatformConsumePurchaseAsync - error: " + err.message);
            {{{ makeDynCall("vi", "callback") }}} (Utils.allocateString(err.code));
        });
    },

    // =====================================
    // CheckCanPlayerMatchAsync
    // =====================================
    FBInstant_PlatformCheckCanPlayerMatchAsync: function(callback) {
        FBInstant.checkCanPlayerMatchAsync().then(function(canMatch) {
            if (canMatch) {
                {{{ makeDynCall("vii", "callback") }}} (1, 0);
            }
            else {
                {{{ makeDynCall("vii", "callback") }}} (0, 0);
            }
        }).catch(function(err) {
            console.log("FBInstant_PlatformCanSubscribeBotAsync - error: " + err.message);
            {{{ makeDynCall("vii", "callback") }}} (0, Utils.allocateString(err.code));
        });
    },

};

autoAddDeps(FBInstantLibrary, "$Context");
autoAddDeps(FBInstantLibrary, "$Utils");
autoAddDeps(FBInstantLibrary, "$Ads");

mergeInto(LibraryManager.library, FBInstantLibrary);
