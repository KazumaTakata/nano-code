import { generateText } from '../src/core/generate-text';
import { createOpenAI } from '../src/providers/openai';

const openai = createOpenAI({ baseURL: 'http://host.docker.internal:18000/v1' });
const model = openai('gpt-oss:20b');

const result = await generateText({
    model,
    messages: [{ role: 'user', content: 'Typescriptについて簡潔に説明してください' }],
});

console.log(result.text);
