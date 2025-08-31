const { Pinecone } = require("@pinecone-database/pinecone");


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatGptIndex = pc.Index("chat-gpt-project"); // Index matlab jaha par hum apne vectors store karenge

async function createMemory({ vectors, metadata, messageID }) {
  await chatGptIndex.upsert([
    {
      id: messageID,
      values: vectors,
      metadata: metadata,
    },
  ]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await chatGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeMetadata: true,
  });

  return data.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};
