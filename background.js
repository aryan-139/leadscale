chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "sendToPython",
      title: "Send selected text to stack",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendToPython") {
      const selectedText = info.selectionText;
      fetch('http://127.0.0.1:8000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: selectedText })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Text sent to FastAPI server:', data);
      })
      .catch(err => {
        console.error('Error sending text to FastAPI server:', err);
      });
    }
  });
  