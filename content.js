// content.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Content script injected into:", window.location.href);
  const stackList = document.getElementById("stack-list");
  const refreshButton = document.getElementById("refresh-button");
  const triggerButton = document.getElementById("trigger-button");

  function fetchStack() {
    chrome.storage.local.get({ stack: [] }, (result) => {
      const data = result.stack;
      stackList.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        data
          .slice()
          .reverse()
          .forEach((item, index) => {
            const realIndex = data.length - 1 - index;

            const li = document.createElement("li");
            li.className = "stack-item" + (index === 0 ? " highlight" : "");

            const textSpan = document.createElement("span");
            textSpan.className = "stack-text";
            textSpan.textContent = `${realIndex + 1}. ${item}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "❌";

            deleteBtn.onclick = () => {
              chrome.storage.local.get({ stack: [] }, (res) => {
                const updatedStack = res.stack;
                updatedStack.splice(realIndex, 1);
                chrome.storage.local.set({ stack: updatedStack }, () => {
                  fetchStack(); // Refresh
                });
              });
            };

            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            stackList.appendChild(li);
          });
      } else {
        const li = document.createElement("li");
        li.textContent = "(Stack is empty)";
        li.style.color = "#888";
        stackList.appendChild(li);
      }
    });
  }

  function triggerHandler() {
    const companyName = document.getElementById("company-name").value.trim();
    const jobDescription = document
      .getElementById("job-description")
      .value.trim();
    const intent = document.getElementById("intent").value;
    const customAddress = document
      .getElementById("custom-address")
      .value.trim() || null;
    const emailFormat = document.getElementById("email-format").value || "first_period_last";

    if (!companyName) {
      alert("Please enter a company name.");
      return;
    }

    chrome.storage.local.get({ stack: [] }, (result) => {
      const stack = result.stack;
      if (!stack.length) {
        alert("⚠️ Lead list is empty!");
        return;
      }
      alert(`Triggering for company: ${companyName}`);
      fetch("http://127.0.0.1:8000/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: intent,
          company_name: companyName,
          job_description: jobDescription,
          lead_list: stack,
          custom_address: customAddress,
          email_format: emailFormat,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Triggered successfully:", data);
          chrome.storage.local.set({ stack: [] }, () => {
            document.getElementById("company-name").value = "";
            fetchStack();
          });
        })
        .catch((err) => {
          console.error("❌ Trigger failed:", err);
        });
    });
  }

  refreshButton.onclick = fetchStack;
  triggerButton.onclick = triggerHandler;

  fetchStack();
});
