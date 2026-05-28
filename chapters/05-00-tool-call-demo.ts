import { generateText } from '../src/core/generate-text';
import { createOpenAI } from '../src/providers/openai';
import { readFile } from '../src/tools/readFile';

const openai = createOpenAI({ baseURL: 'http://host.docker.internal:18000/v1' });
const model = openai('gpt-oss:20b');

const result = await generateText({
    model,
    messages: [{ role: 'user', content: '0500docs.mdの内容を教えてください' }],
    tools: [readFile],
});

// 大抵の場合、toolCallsとしてreadFileの呼び出しが入る。
/*
 toolCalls: [
    {
      toolCallId: "call_ltepbq6w",
      name: "readFile",
      arguments: {
        path: "docs.md",
      },
    }
  ],
 */
console.dir(result, { depth: 4 });
