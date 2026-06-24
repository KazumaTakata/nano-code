// 第6章 6.2「起動時の初期化フロー」のハンズオン挙動確認。
// 確認すること:
//   - loadInstructions() がベースプロンプト（src/core/prompt.md）を必須で読み込み、
//     workspaceRoot に AGENTS.md があればそれを連結すること。
//   - AGENTS.md が無い場合はベースプロンプトのみを返すこと。

import * as os from 'os';
import * as path from 'path';
import { loadInstructions } from '../src/core/prompt';

// 1. AGENTS.md あり（このリポジトリの workspace/AGENTS.md を使用）
const workspaceRoot = path.resolve(process.cwd(), 'workspace');
console.log('=== ケース1: workspace/AGENTS.md あり（ベース + プロジェクト固有）===');
const withAgents = loadInstructions(workspaceRoot);
console.log(withAgents);
console.log('='.repeat(60) + '\n');

// 2. AGENTS.md なし（一時ディレクトリを指定 → ベースプロンプトのみ）
const emptyDir = os.tmpdir(); // AGENTS.md が存在しないディレクトリ
console.log('=== ケース2: AGENTS.md なし（ベースプロンプトのみ）===');
const baseOnly = loadInstructions(emptyDir);
console.log(baseOnly);
console.log('='.repeat(60) + '\n');

// 3. 連結の有無を要約表示
console.log('=== 結果サマリ ===');
console.log(`ケース1 文字数: ${withAgents.length}`);
console.log(`ケース2 文字数: ${baseOnly.length}`);
console.log(`AGENTS.md が連結されている: ${withAgents.includes('プロジェクト固有の指示')}`);
