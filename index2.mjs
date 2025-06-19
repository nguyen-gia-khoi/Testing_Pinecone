import 'dotenv/config';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = 'quicksart-js';

const index = pc.index(indexName).namespace("disease_suggestions");
// await index.upsertRecords(records);
const index2 = pc.index(indexName).namespace("food_suggestions");


const query = 'Tôi bị mệt tim và cơ thể bị mất sức khi vận động mạnh thì tôi nên ăn như thế nào?';

// Search the dense index
const results = await index.searchRecords({
  query: {
    topK: 10,
    inputs: { text: query },
  },
   rerank: {
    model: 'bge-reranker-v2-m3',
    topN: 3,
    rankFields: ['chunk_text'],
  }
});
// Print the results
results.result.hits.forEach(hit => {
  console.log(`id: ${hit._id}, score: ${hit._score?.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
});
const retrievedChunks = (results.result?.hits ?? []).map(hit => hit.fields?.chunk_text ?? '');

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: 'Bạn là một trợ lý chuyên giúp tạo lại câu hỏi để tìm kiếm thông tin tốt hơn từ dữ liệu y tế.'
    },
    {
      role: 'user',
      content: `
Tôi vừa tìm kiếm với câu: "${query}" và nhận được một số đoạn văn liên quan như sau:

${retrievedChunks.map((text, i) => `(${i + 1}) ${text}`).join('\n\n')}

Dựa vào các đoạn văn này, bạn hãy phân tích và tổng kết lại những chất dinh dưỡng nào cần thiết và chất nào cần tránh cho người có những dấu hiệu bệnh trên theo format sau. các chất cần bổ xung : , Các chất cần nên tránh : .
`
    }
  ],
  temperature: 0.3,
});
console.log('Câu truy vấn mới:', response.choices[0].message.content);
// console.log(results.result.hits);