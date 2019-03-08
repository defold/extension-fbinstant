#pragma once

#include <dmsdk/sdk.h>

#if defined(DM_PLATFORM_HTML5)

typedef void (*OnInitializedCallback)(const int success);
typedef void (*OnPlayerDataCallback)(const char* data);
typedef void (*OnPlayerDataSetCallback)(const int success);
typedef void (*OnPlayerDataFlushedCallback)(const int success);
typedef void (*OnPlayerStatsCallback)(const char* stats);
typedef void (*OnPlayerStatsSetCallback)(const int success);
typedef void (*OnPlayerStatsIncrementedCallback)(const char* stats);
typedef void (*OnGameStartedCallback)(const int success);
typedef void (*OnGameSwitchedCallback)(const int success);
typedef void (*OnUpdatedCallback)(const int success);
typedef void (*OnShareCallback)(const int success);
typedef void (*OnPauseCallback)();
typedef void (*OnContextCallback)(const char* id, const char* type);
typedef void (*OnGetPlayersInContext)(int count);
typedef void (*OnEntryPointCallback)(const char* entrypoint);
typedef void (*OnStoreCreatedCallback)(const char* storeId);
typedef void (*OnStoreClosedCallback)(const int success);
typedef void (*OnStoresCallback)(const char* stores);
typedef void (*OnStoreDataCallback)(const char* data);
typedef void (*OnStoreDataSavedCallback)(const int success);
typedef void (*OnStoreDataIncrementedCallback)(const char* data);
typedef void (*OnInterstitialAdLoadedCallback)(const int success);
typedef void (*OnInterstitialAdShownCallback)(const int success);
typedef void (*OnRewardedVideoLoadedCallback)(const int success);
typedef void (*OnRewardedVideoShownCallback)(const int success);
typedef void (*OnConnectedPlayersCallback)(const char* players);
typedef void (*OnCanCreateShortcutCallback)(const int success);
typedef void (*OnCreateShortcutCallback)(const int success);
typedef void (*OnCanSubscribeBotCallback)(const int success);
typedef void (*OnSubscribeBotCallback)(const int success);
typedef void (*OnSignedPlayerInfoCallback)(const char* signature);
typedef void (*OnLeaderboardCallback)(const char* contextId, const int entryCount);
typedef void (*OnLeaderboardScoreSetCallback)(const int score, const char* extraData);
typedef void (*OnLeaderboardScoreCallback)(const int rank, const int score, const char* extraData);
typedef void (*OnLeaderboardEntriesCallback)(const char* entries);
typedef void (*OnPaymentsReadyCallback)();
typedef void (*OnProductCatalogCallback)(const char* productCatalog);
typedef void (*OnPurchaseResponseCallback)(const char* purchase);
typedef void (*OnPurchaseConsumedCallback)(const int success);
typedef void (*OnPurchasesCallback)(const char* purchases);

extern "C" {
    void FBInstant_PlatformInitializeAsync(OnInitializedCallback callback);
    void FBInstant_PlatformStartGameAsync(OnGameStartedCallback callback);
    void FBInstant_PlatformSwitchGameAsync(OnGameSwitchedCallback callback);
    void FBInstant_PlatformUpdateAsync(OnUpdatedCallback callback, const char* json);
    void FBInstant_PlatformQuit();
    void FBInstant_PlatformOnPause(OnPauseCallback callback);
    void FBInstant_PlatformSetLoadingProgress(int progress);

    void FBInstant_PlatformGetSignedPlayerInfoAsync(OnSignedPlayerInfoCallback callback, const char* payload);

    void FBInstant_PlatformGetPlayerDataAsync(OnPlayerDataCallback callback, const char* json);
    void FBInstant_PlatformSetPlayerDataAsync(OnPlayerDataSetCallback callback, const char* json);
    void FBInstant_PlatformFlushPlayerDataAsync(OnPlayerDataFlushedCallback callback);

	void FBInstant_PlatformGetPlayerStatsAsync(OnPlayerStatsCallback callback, const char* json);
    void FBInstant_PlatformSetPlayerStatsAsync(OnPlayerStatsSetCallback callback, const char* json);
    void FBInstant_PlatformIncrementPlayerStatsAsync(OnPlayerStatsIncrementedCallback callback, const char* json);

    void FBInstant_PlatformSetSessionData(const char* json);
    char* FBInstant_PlatformGetEntryPointData();
    void FBInstant_PlatformGetEntryPointAsync(OnEntryPointCallback callback);

    char* FBInstant_PlatformGetPlayerName();
    char* FBInstant_PlatformGetPlayerId();
    char* FBInstant_PlatformGetPlayerPhoto();
    char* FBInstant_PlatformGetPlayerLocale();

    char* FBInstant_PlatformGetConnectedPlayersAsync(OnConnectedPlayersCallback callback);

    void FBInstant_PlatformCanSubscribeBotAsync(OnCanSubscribeBotCallback callback);
    void FBInstant_PlatformSubscribeBotAsync(OnSubscribeBotCallback callback);

    char* FBInstant_PlatformGetPlatform();
    char* FBInstant_PlatformGetLocale();
    char* FBInstant_PlatformGetSupportedAPIs();
    char* FBInstant_PlatformGetSDKVersion();
    void FBInstant_PlatformCanCreateShortcutAsync(OnCanCreateShortcutCallback callback);
    void FBInstant_PlatformCreateShortcutAsync(OnCreateShortcutCallback callback);

    void FBInstant_PlatformLogEvent(const char* eventName, int valueToSum, const char* parametersJson);

    void FBInstant_PlatformShareAsync(OnShareCallback callback, const char* payloadJson);

    void FBInstant_PlatformChooseContextAsync(OnContextCallback callback, const char* optionsJson);
    void FBInstant_PlatformCreateContextAsync(OnContextCallback callback, const char* playerId);
    void FBInstant_PlatformSwitchContextAsync(OnContextCallback callback, const char* contextId);
    char* FBInstant_PlatformGetContextID();
    char* FBInstant_PlatformGetContextType();

    int FBInstant_PlatformIsSizeBetween(const int min, const int max);

    void FBInstant_PlatformGetPlayersInContextAsync(OnGetPlayersInContext callback);
    char* FBInstant_PlatformGetPlayerIdInContext(const int index);
    char* FBInstant_PlatformGetPlayerNameInContext(const int index);
    char* FBInstant_PlatformGetPlayerPhotoInContext(const int index);

    void FBInstant_PlatformCreateStoreAsync(OnStoreCreatedCallback callback, const char* storeName);
    void FBInstant_PlatformCloseStoreAsync(OnStoreClosedCallback callback, const char* storeName);
    void FBInstant_PlatformGetStoresAsync(OnStoresCallback callback);
    void FBInstant_PlatformGetStoreDataAsync(OnStoreDataCallback callback, const char* storeName, const char* keysJson);
    void FBInstant_PlatformSaveStoreDataAsync(OnStoreDataSavedCallback callback, const char* storeName, const char* dataJson);
    void FBInstant_PlatformIncrementStoreDataAsync(OnStoreDataIncrementedCallback callback, const char* storeName, const char* dataJson);

    void FBInstant_PlatformLoadInterstitialAdAsync(OnInterstitialAdLoadedCallback callback, const char* placementId);
    void FBInstant_PlatformShowInterstitialAdAsync(OnInterstitialAdShownCallback callback, const char* placementId);

    void FBInstant_PlatformLoadRewardedVideoAsync(OnRewardedVideoLoadedCallback callback, const char* placementId);
    void FBInstant_PlatformShowRewardedVideoAsync(OnRewardedVideoShownCallback callback, const char* placementId);

    void FBInstant_PlatformGetLeaderboardAsync(OnLeaderboardCallback callback, const char* name);
    void FBInstant_PlatformSetLeaderboardScoreAsync(OnLeaderboardScoreSetCallback callback, const char* name, const int score, const char* extraData);
    void FBInstant_PlatformGetLeaderboardScoreAsync(OnLeaderboardScoreCallback callback, const char* name);
    void FBInstant_PlatformGetLeaderboardEntriesAsync(OnLeaderboardEntriesCallback callback, const char* name, const int count, const int offset);

    void FBInstant_PlatformOnPaymentsReady(OnPaymentsReadyCallback callback);
    void FBInstant_PlatformGetProductCatalogAsync(OnProductCatalogCallback callback);
    void FBInstant_PlatformPurchaseAsync(OnPurchaseResponseCallback callback, const char* productId, const char* developerPayload);
    void FBInstant_PlatformGetPurchasesAsync(OnPurchasesCallback callback);
    void FBInstant_PlatformConsumePurchaseAsync(OnPurchaseConsumedCallback callback, const char* purchaseToken);
}

#endif
