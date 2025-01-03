document.addEventListener('DOMContentLoaded', function() {
    const websiteInput = document.getElementById('websiteInput');
    const addButton = document.getElementById('addWebsite');
    const websiteList = document.getElementById('websiteList');
  
    // Load existing websites
    loadWebsites();
  
    // Add website
    addButton.addEventListener('click', function() {
      const website = websiteInput.value.trim();
      if (website) {
        addWebsiteToList(website);
        websiteInput.value = '';
      }
    });
  
    // Load websites from storage
    function loadWebsites() {
      chrome.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites || {};
        for (const site in sites) {
          createWebsiteElement(site, sites[site]);
        }
      });
    }
  
    // Add website to storage and UI
    function addWebsiteToList(website) {
      chrome.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites || {};
        sites[website] = true; // blocked by default
        chrome.storage.sync.set({ blockedSites: sites }, function() {
          createWebsiteElement(website, true);
        });
      });
    }
  
    // Create website element in UI
    function createWebsiteElement(website, blocked) {
      const div = document.createElement('div');
      div.className = 'website-item';
      
      const span = document.createElement('span');
      span.textContent = website;
      
      const controls = document.createElement('div');
      controls.className = 'website-controls';
      
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = blocked;
      toggle.addEventListener('change', function() {
        updateWebsiteStatus(website, toggle.checked);
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function() {
        deleteWebsite(website, div);
      });
      
      controls.appendChild(toggle);
      controls.appendChild(deleteBtn);
      div.appendChild(span);
      div.appendChild(controls);
      websiteList.appendChild(div);
    }
  
    // Update website blocking status
    function updateWebsiteStatus(website, blocked) {
      chrome.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites || {};
        sites[website] = blocked;
        chrome.storage.sync.set({ blockedSites: sites });
      });
    }
  
    // Delete website
    function deleteWebsite(website, element) {
      chrome.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites || {};
        delete sites[website];
        chrome.storage.sync.set({ blockedSites: sites }, function() {
          element.remove();
        });
      });
    }
  });