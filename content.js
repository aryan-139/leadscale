// content.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Content script injected into:", window.location.href);
  const stackList = document.getElementById("stack-list");
  const refreshButton = document.getElementById("refresh-button");
  const triggerButton = document.getElementById("trigger-button");

  function fetchStack() {
    console.log("🔄 Fetching stack from server...");
    fetch("http://127.0.0.1:8000/stack")
      .then((res) => res.json())
      .then((data) => {
        stackList.innerHTML = "";
        if (Array.isArray(data) && data.length > 0) {
          data
            .slice()
            .reverse()
            .forEach((item, index) => {
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
    const companyName = document.getElementById("company-name").value.trim();
    if (!companyName) {
      alert("Please enter a company name.");
      return;
    }
  
    alert(`Triggering for company: ${companyName}`);
  
    fetch("http://127.0.0.1:8000/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "list",
        company: companyName
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Triggered successfully:", data);
        fetchStack(); // Refresh stack after triggering
      })
      .catch((err) => {
        console.error("❌ Trigger failed:", err);
      });
  }
  

  refreshButton.onclick = fetchStack;
  triggerButton.onclick = triggerHandler;

  fetchStack();
});
