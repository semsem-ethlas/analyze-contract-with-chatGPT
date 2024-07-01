document
  .getElementById("audit-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const contractAddress = document.getElementById("contract-address").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Auditing...";

    try {
      const response = await fetch("/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: contractAddress }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      displayResults(result);
    } catch (error) {
      console.error("Error during audit request:", error);
      resultsDiv.innerHTML = "Error: " + error.message;
    }
  });

function displayResults(result) {
  const resultsDiv = document.getElementById("results");
  if (result.error) {
    resultsDiv.innerHTML = "Error: " + result.error;
    return;
  }
  const vulnerabilities = result.vulnerabilities;
  resultsDiv.innerHTML = `<pre>${vulnerabilities}</pre>`;
}
