// content.js
document.addEventListener("DOMContentLoaded", () => {
  const stackList = document.getElementById("stack-list");
  const refreshButton = document.getElementById("refresh-button");
  const triggerButton = document.getElementById("trigger-button");

  function fetchStack() {
    fetch("http://127.0.0.1:8000/stack")
      .then((res) => res.json())
      .then((data) => {
        stackList.innerHTML = "";
        if (Array.isArray(data) && data.length > 0) {
          data.slice().reverse().forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${data.length - index}. ${item}`;
            li.style.backgroundColor = index === 0 ? "#ffffcc" : "";
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
  function triggerHandler() {
    console.log("🔄 Triggering handler...");
  }
  
  refreshButton.onclick = fetchStack;
  triggerButton.onclick = triggerHandler;

  fetchStack(); 

});
