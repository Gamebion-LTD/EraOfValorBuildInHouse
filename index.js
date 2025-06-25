function init() {
  // ServiceWorker clean
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister().then(success => {
          if (success) {
            console.log('Service Worker unregistered:', registration);
          } else {
            console.warn('Service Worker unregister error:', registration);
          }
        });
      });
    }).catch(error => {
      console.error('Service Workers error:', error);
    });
  } else {
    console.warn('Service Workers is not available');
  }

  // Cache storage clean
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName).then(success => {
          if (success) {
            console.log(`Cache "${cacheName}" deleted.`);
          } else {
            console.warn(`Failed to delete cache "${cacheName}".`);
          }
        });
      });
    }).catch(error => {
      console.error('Error retrieving caches:', error);
    });
  } else {
    console.warn('Cache Storage is not supported in this browser.');
  }

  // Telegram SDK init
  Telegram.WebApp.expand();
  Telegram.WebApp.ready();

  const mockData = "hello";
  const initData = Telegram.WebApp.initData ?? mockData;

  if (window.unityInstance) {
    console.log("send data from js init", initData);
    window.unityInstance.SendMessage("Loader", "OnTelegramReady", initData);
  }
}

window.onload = init;

async function createTransaction(price) {
  try {
    const connectedWallet = tonConnectUI.wallet;
    if (!connectedWallet) {
      return;
    }

    const toAddress = "UQBlvlMVBZ5sqM_fKc1qGCR5KrYHEbqjJCHBMYLAZ5vVTwKo";

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: toAddress,
          amount: price,
          payload: null
        }
      ]
    };

    await tonConnectUI.sendTransaction(transaction);
  } catch (error) {
    console.log("transaction error:", error);
  }
}

async function connectWallet() {
  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://gamebion-ltd.github.io/EraOfValorBuild/manifest.json',
  });

  window.tonConnectUI = tonConnectUI;

  window.unityInstance.SendMessage("TelegramBridge", "OnWalletConnected", "xxxxx");

  const connectedWallet = await tonConnectUI.connectWallet();
  console.log("connected wallet", connectedWallet);

  if (connectedWallet && connectedWallet.account) {
    const walletAddress = connectedWallet.account.address;
    window.unityInstance.SendMessage("TelegramBridge", "OnWalletConnected", walletAddress);
  }
}

function toggleFullscreen(data) {
  if (Telegram.WebApp.isFullscreen) {
    Telegram.WebApp.exitFullscreen();
  } else {
    Telegram.WebApp.requestFullscreen();
  }
}
