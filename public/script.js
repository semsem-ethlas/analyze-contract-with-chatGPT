/* public/script.js */
document
  .getElementById("audit-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const contractAddress = document.getElementById("contract-address").value;
    const response = await fetch("/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractAddress }),
    });
    const result = await response.json();
    document.getElementById("results").innerText =
      result.analysis || result.error;
  });
