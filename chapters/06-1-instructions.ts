// 第6章 6.1「Nano Codeに明確な指示を与える」のハンズオン挙動確認。
// 確認すること:
//   - instructions（システムプロンプト = src/core/prompt.md + workspace/AGENTS.md）が
//     エージェントに「TODOリストの作成」と「構造化された結果報告」を促すこと。
import * as path from 'path';
import { Agent } from '../src/core/agent';
import { loadInstructions } from '../src/core/prompt';
import { createOpenAI } from '../src/providers/openai';
import { readFile } from '../src/tools/readFile';

const model = createOpenAI({
    apiKey: 'dummy-key',
    baseURL: 'http://host.docker.internal:18000/v1',
})('gpt-oss:20b');

const workspaceRoot = path.resolve(process.cwd(), 'workspace');
const instructions = loadInstructions(workspaceRoot);

console.log('=== 組み立てられた instructions ===');
console.log(instructions);
console.log('='.repeat(60) + '\n');

const agent = new Agent({
    name: 'nano-code',
    instructions,
    model,
    tools: { readFile },
    maxSteps: 10,
    verbose: true,
});

const result = await agent.generate(
    'AGENTS.md を読んで、このプロジェクトのテスト方法を日本語で簡潔に教えてください',
);

console.log('\n=== 最終出力（結果報告を含むはず）===');
console.log(result.text);
