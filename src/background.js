chrome.action.onClicked.addListener(async (tab) => {
    // Query tabs from the same window as the clicked tab
    const tabs = await chrome.tabs.query({ windowId: tab.windowId });

    // Sort tabs by domain name
    const sortedTabs = [...tabs].sort((a, b) => {
        const domainA = new URL(a.url).hostname;
        const domainB = new URL(b.url).hostname;
        
        // Get the top-level domains (last two parts of the hostname)
        const topLevelA = domainA.split('.').slice(-2).join('.');
        const topLevelB = domainB.split('.').slice(-2).join('.');
        
        // First compare by top-level domains
        const topLevelComparison = topLevelA.localeCompare(topLevelB);
        if (topLevelComparison !== 0) {
            return topLevelComparison;
        }
        
        // If top-level domains are the same, sort by full hostname length
        return domainA.length - domainB.length;
    });

    // Move each tab to its new position
    for (let i = 0; i < sortedTabs.length; i++) {
        chrome.tabs.move(sortedTabs[i].id, { index: i });
    }
});