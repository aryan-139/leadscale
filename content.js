(function () {
  console.log("📦 content script loaded");
    const existingBox = document.getElementById("text-stack-box");
    if (existingBox) return;
  
    const box = document.createElement("div");
    box.id = "text-stack-box";
    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.right = "20px";
    box.style.width = "300px";
    box.style.maxHeight = "400px";
    box.style.overflowY = "auto";
    box.style.backgroundColor = "#fff";
    box.style.border = "1px solid #ccc";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    box.style.zIndex = "9999";
    box.style.padding = "10px";
    box.style.fontFamily = "monospace";
    box.style.fontSize = "14px";
  
    const title = document.createElement("div");
    title.textContent = "🗂️ Stack Viewer";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
  
    const stackList = document.createElement("ul");
    stackList.id = "stack-list";
    stackList.style.padding = "0";
    stackList.style.margin = "0";
    stackList.style.listStyle = "none";
  
    const refreshButton = document.createElement("button");
    refreshButton.textContent = "🔄 Refresh";
    refreshButton.style.marginTop = "10px";
    refreshButton.style.padding = "4px 10px";
    refreshButton.style.cursor = "pointer";
  
    refreshButton.onclick = fetchStack;
  
    box.appendChild(title);
    box.appendChild(stackList);
    box.appendChild(refreshButton);
    document.body.appendChild(box);
  
    // Initial fetch
    fetchStack();
  
    function fetchStack() {
      fetch("http://127.0.0.1:8000/stack")
        .then((res) => res.json())
        .then((data) => {
          stackList.innerHTML = "";
          if (Array.isArray(data) && data.length > 0) {
            data.slice().reverse().forEach((item, index) => {
              const li = document.createElement("li");
              li.textContent = `${data.length - index}. ${item}`;
              li.style.borderBottom = "1px solid #eee";
              li.style.padding = "4px 0";
              li.style.transition = "background 0.3s ease";
              li.style.backgroundColor = index === 0 ? "#ffffcc" : ""; // highlight newest
              stackList.appendChild(li);
            });
          } else {
            const li = document.createElement("li");
            li.textContent = "(Stack is empty)";
            li.style.color = "#888";
            stackList.appendChild(li);
          }
        })
        .catch((err) => {
          console.error("❌ Failed to fetch stack:", err);
        });
    }
    
  })();
  