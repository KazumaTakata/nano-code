import { generateText } from '../src/core/generate-text';
import { createOpenAI } from '../src/providers/openai';
import { allTools } from '../src/tools/index';
import type { Message } from '../src/types';

const model = createOpenAI({
    apiKey: 'dummy-key', // llama-serverなのでdummy
    baseURL: 'http://host.docker.internal:18000/v1',
})('gpt-oss:20b');

const messages: Message[] = [
    {
        role: 'user',
        content:
            '0502docs.mdのコードの説明セクションの続きを0502docs.mdへ書き込んでください。コードの説明はフローチャートのように技術の詳細を省いた大まかな流れを記載してください',
    },
];

let finalText = '';

// loop内でmessage, finalTextの更新, log出力を行う
while (true) {
    const result = await generateText({
        model,
        messages,
        tools: allTools,
    });

    // 呼び出し依頼されたツールと引数のペアを抽出する
    const requestedTools =
        result.toolCalls?.flatMap((toolCall) => {
            const maybeTool = allTools.find((t) => t.name === toolCall.name);

            return maybeTool === undefined
                ? []
                : [
                      {
                          name: maybeTool.name,
                          execute: maybeTool.execute,
                          arguments: toolCall.arguments,
                          toolCallId: toolCall.toolCallId,
                      },
                  ];
        }) ?? [];

    // 命令
    console.log(`LLMの返答: ${finalText}`);
    console.log(`messageの終了理由: ${result.finishReason}`);

    if (result.text) {
        finalText = result.text;
    }

    // 呼び出し依頼された各ツールを用いて命令を実行する
    let toolMessages: Message[] = [];
    for (const tool of requestedTools ?? []) {
        console.log(`ツール ${tool.name} を呼び出します。引数: ${JSON.stringify(tool.arguments)}`);
        const content = await tool.execute(tool.arguments);

        console.log(`ツール ${tool.name} の実行結果:`);
        console.log('---\n');
        console.log(content);
        console.log('\n---');

        toolMessages.push({ role: 'tool', content, toolCallId: tool.toolCallId, name: tool.name });
    }

    // LLMの返答を履歴に追加する
    toolMessages.forEach((m) => messages.push(m));
    messages.push({ role: 'assistant', content: result.text });

    // stopになるまで続けてllmに終了の判断を任せる.
    if (result.finishReason === 'stop') break;
}

console.log('最終的なLLMの返答:');
console.log(finalText);
console.log(`Total messages: ${messages.length}`);
