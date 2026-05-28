import { generateText } from '../src/core/generate-text';
import { createOpenAI } from '../src/providers/openai';
import { readFile } from '../src/tools/readFile';

const openai = createOpenAI({ baseURL: 'http://host.docker.internal:18000/v1' });
const model = openai('gpt-oss:20b');

const tools = [readFile];

const result = await generateText({
    model,
    messages: [{ role: 'user', content: '0502docs.mdの内容を教えてください' }],
    tools,
});

console.log('LLMの返答:');
console.dir(result, { depth: 4 });

console.log('LLMの返答から、ツール呼び出し依頼を確認し実行する。');

// 呼び出し依頼されたツールと引数のペアを抽出する
const requestedTools = result.toolCalls?.flatMap((toolCall) => {
    const maybeTool = tools.find((t) => t.name === toolCall.name);

    return maybeTool === undefined
        ? []
        : [{ name: maybeTool.name, execute: maybeTool.execute, arguments: toolCall.arguments }];
});

// 呼び出し依頼された各ツールを用いて命令を実行する
for (const tool of requestedTools ?? []) {
    console.log(`ツール ${tool.name} を呼び出します。引数: ${JSON.stringify(tool.arguments)}`);
    const a = await tool.execute(tool.arguments);

    console.log(`ツール ${tool.name} の実行結果: ${a}`);
}
