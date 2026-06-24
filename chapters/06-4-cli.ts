// 第6章 6.2「CLIで動くNano Code」/ 6.3「実行例と出力」のハンズオン挙動確認。
// 確認すること:
//   - bin/cli.ts と同じ組み立て（createModelFromEnv + loadInstructions + 4ツール + maxSteps:15）
//     で、自然言語の指示から calculator.ts 作成 → テスト追加 までを自律実行できること。
//
//   $ bun run agent "calculator.ts の関数にテストを追加してください"
//
// このデモは検証用に固定タスクを2件続けて実行する。
// write/exec 系ツールは承認が必要だが、無人実行のため auto-approve を注入している
// （実運用ではデフォルトの対話的承認 src/core/approval.ts が使われる）。

import * as path from 'path';
import { Agent } from '../src/core/agent';
import { loadInstructions } from '../src/core/prompt';
import { createModelFromEnv } from '../src/providers/modelFactory';
import { readFile } from '../src/tools/readFile';
import { writeFile } from '../src/tools/writeFile';
import { editFile } from '../src/tools/editFile';
import { execCommand } from '../src/tools/execCommand';

// 環境変数からモデルを生成（openai → ローカルLLM）
process.env.LLM_PROVIDER ??= 'openai';
process.env.LLM_MODEL ??= 'gpt-oss:20b';
const model = createModelFromEnv();

const workspaceRoot = path.resolve(process.cwd(), 'workspace');
const instructions = loadInstructions(workspaceRoot);

const agent = new Agent({
    name: 'nano-code',
    model,
    instructions,
    tools: { readFile, writeFile, editFile, execCommand },
    maxSteps: 15,
    verbose: true,
    // 検証用: すべてのツール実行を自動承認（無人実行のため）
    approvalFunc: async (toolName, args) => {
        console.log(`[auto-approve] ${toolName}(${JSON.stringify(args)})`);
        return true;
    },
});

async function run(task: string) {
    console.log('\nエージェント起動');
    console.log(`タスク: ${task}`);
    console.log('─'.repeat(60));
    const result = await agent.generate(task);
    console.log('─'.repeat(60));
    console.log(result.text);
    console.log('タスク完了\n');
}

// 6.3 の実行例: サンプル作成 → テスト追加
await run(
    'calculator.ts を作成してください。add関数とdivide関数を実装し、divideはゼロ除算時にエラーを投げるようにしてください',
);
await run('calculator.ts の関数にテストを追加してください');
