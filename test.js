const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "sk-proj-BjtsjLJre7GoCeUf8VMWT3BlbkFJXEPwEpqmqBssLjGfd35N",
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: [{ role: "user", content: "hello" }],
    });

    const message = response.choices[0].message.content;
    console.log(message);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
