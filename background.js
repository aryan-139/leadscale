// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-selected-text",
    title: "Send text to Lead-Gen",
    contexts: ["selection"],
    documentUrlPatterns: ["<all_urls>"],
    type: "normal"
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-selected-text") {
    sendSelectedText(tab);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "send-selected-text") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    sendSelectedText(tab);
  }
});

function sendSelectedText(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    },
    (results) => {
      const selectedText = results?.[0]?.result;
      if (selectedText) {
        // Get current stack from local storage
        chrome.storage.local.get({ stack: [] }, (result) => {
          const currentStack = result.stack;
          currentStack.push(selectedText);

          // Save updated stack
          chrome.storage.local.set({ stack: currentStack }, () => {
            console.log("✅ Stored locally:", selectedText);
          });
        });
      } else {
        console.log("⚠️ No text selected");
      }
    }
  );
}
