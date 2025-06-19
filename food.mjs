import 'dotenv/config';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });


const indexName = 'quicksart-js';

const index = pc.index(indexName).namespace("disease_suggestions");
// await index.upsertRecords(records);
const index2 = pc.index(indexName).namespace("food_suggestions");

const query = 'Các chất cần bổ xung: Kali (chuối, khoai lang), Magiê (rau xanh, hạt), Omega-3 (cá, hạt), Chất xơ (rau, trái cây, ngũ cốc nguyên hạt), Protein nạc (gà, cá).';
const results = await index2.searchRecords({
    query: {
      topK: 10,
      inputs: { text: query },
      filter: { dish_type: "Món chính" }
    },
     rerank: {
      model: 'bge-reranker-v2-m3',
      topN: 5,
      rankFields: ['chunk_text'],
    }
  });
  // Print the results
  results.result.hits.forEach(hit => {
    console.log(`id: ${hit._id}, score: ${hit._score?.toFixed(2)}, text: ${hit.fields.chunk_text}`);
  });