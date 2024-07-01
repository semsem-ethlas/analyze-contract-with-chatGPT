import axios from "axios";
import { openaiApiKey, etherscanApiKey } from "./config.js"; // Store your API keys in a config file

export async function auditSmartContract(address) {
  try {
    const etherscanResponse = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: "contract",
        action: "getsourcecode",
        address: address,
        apikey: etherscanApiKey,
      },
    });

    console.log("Etherscan response:", etherscanResponse.data); // Log the full response

    if (etherscanResponse.data.status !== "1") {
      throw new Error("Failed to fetch contract source code from Etherscan");
    }

    const sourceCode = etherscanResponse.data.result[0].SourceCode;
    const chatGPTAnalysis = await analyzeWithChatGPT(sourceCode);
    console.log("chatGPTAnalysis: " + chatGPTAnalysis);

    return chatGPTAnalysis;
  } catch (error) {
    console.error(`Error auditing address ${address}:`, error.message);
    throw new Error(`chatGPTAnalysis: ${error.message}`);
  }
}

async function analyzeWithChatGPT(sourceCode) {
  const prompt = `Analyze the following Solidity smart contract code and identify any potential vulnerabilities. Provide detailed explanations and suggested fixes for each vulnerability.\n\n${sourceCode}`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-4-0613", // Use the appropriate model for your task
        messages: prompt,
        //max_tokens: 1000, // Adjust the number of tokens based on your needs
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    console.log("OpenAI response:", response.data); // Log the full response

    if (response.status !== 200) {
      throw new Error(
        `Failed to analyze with ChatGPT: Request failed with status code ${response.status}`
      );
    }

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error analyzing with ChatGPT:", error);
    throw new Error(`Failed to analyze with ChatGPT: ${error.message}`);
  }
}
