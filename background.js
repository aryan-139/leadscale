// Register context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-selected-text",
    title: "Send selected text to FastAPI",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-selected-text") {
    sendSelectedText(tab);
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "send-selected-text") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    sendSelectedText(tab);
  }
});

// Shared logic: get selection from tab and send it to backend
function sendSelectedText(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    },
    (results) => {
      const selectedText = results?.[0]?.result;
      if (selectedText) {
        fetch("http://127.0.0.1:8000/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: selectedText }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Sent to server:", data);
          })          
          .catch((err) => console.error("❌ Error sending text:", err));
      } else {
        console.log("⚠️ No text selected");
      }
    }
  );
}
