import { generateText } from '../src/core/generate-text';
import { createOpenAI } from '../src/providers/openai';
import type { Message } from '../src/types';

const model = createOpenAI({
    apiKey: 'dummy-key', // llama-serverなのでdummy
    baseURL: 'http://host.docker.internal:18000/v1',
})('gpt-oss:20b');

const messages: Message[] = [
    {
        role: 'user',
        content:
            'TypeScriptについて教えてください. やりやすければメッセージを分けて説明してくれてもいいよ.',
    },
];

while (true) {
    const result = await generateText({
        model,
        messages,
    });

    console.log(result.text);

    // LLMの返答を履歴に追加する
    messages.push({ role: 'assistant', content: result.text });

    // stopになるまで続けてllmに終了の判断を任せる.
    if (result.finishReason === 'stop') break;
}

console.log(`Total messages: ${messages.length}`);
