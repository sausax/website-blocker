chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    const url = new URL(details.url);
    const domain = url.hostname;
  
    chrome.storage.sync.get(['blockedSites'], function(result) {
      const sites = result.blockedSites || {};
      
      for (const site in sites) {
        if (sites[site] && domain.includes(site)) {
          chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL('blocked.html')
          });
          break;
        }
      }
    });
  });