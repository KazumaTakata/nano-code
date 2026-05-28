import { createOpenAI } from '../src/providers/openai';
import { readFile } from '../src/tools/readFile';
import { writeFile } from '../src/tools/writeFile';
import { editFile } from '../src/tools/editFile';
import { execCommand } from '../src/tools/execCommand';
import { Agent } from '../src/core/agent';

// モデルインスタンスを作成
const model = createOpenAI({
    apiKey: 'dummy-key', // llama-serverなのでdummy
    baseURL: 'http://host.docker.internal:18000/v1',
})('gpt-oss:20b');

export const codingAgent = new Agent({
    name: 'nano-code',
    instructions: 'あなたはコーディングエージェントです。慎重に作業してください。',
    model,
    tools: {
        readFile,
        writeFile,
        editFile,
        execCommand,
    },
    maxSteps: 20,
    verbose: true,
});

// 実行（直接実行された場合のみ）
if (import.meta.main) {
    const result = await codingAgent.generate(
        'example.tsファイルを作成し、半加算関数を実装してください。',
    );
    // halfAdder.tsファイルを修正してください。修正内容: - 入力の型をbit（0または1）に変更する。 - ^をxorとして実装し直す。これもbit型を用いて実装する。 - &をandとして実装し直す。これもbit型を用いて実装する。
    // halfAdder.tsファイルを修正してください。修正内容: - xor, and関数を^, &演算子を用いて実装してください。型定義は今のままでOKです。
    console.log(result.text);
}
