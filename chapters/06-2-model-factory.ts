// 第6章 6.2「modelFactoryの実装」のハンズオン挙動確認。
// 確認すること:
//   - createModelFromEnv() が環境変数 LLM_PROVIDER / LLM_MODEL / LLM_API_KEY を読み、
//     コードを変更せずにモデルを生成できること。
//   - 必須環境変数が未設定のときに明確なエラーを投げること。

import { createModelFromEnv } from '../src/providers/modelFactory';
import { generateText } from '../src/core/generate-text';

console.log('=== ケース1: LLM_PROVIDER 未設定 ===');
delete process.env.LLM_PROVIDER;
try {
    createModelFromEnv();
} catch (error) {
    console.log(`期待通りのエラー: ${(error as Error).message}\n`);
}

console.log('=== ケース2: 環境変数からモデル生成して呼び出し ===');
process.env.LLM_PROVIDER = 'openai';
process.env.LLM_MODEL = 'gpt-oss:20b';
// LLM_API_KEY は openai プロバイダーの既定 'dummy' で十分なため省略

const model = createModelFromEnv();
console.log(`モデル生成: provider=${process.env.LLM_PROVIDER}, model=${process.env.LLM_MODEL}`);

const result = await generateText({
    model,
    messages: [{ role: 'user', content: 'TypeScriptを一文で説明してください' }],
});

console.log(`応答: ${result.text}`);
console.log(`finishReason: ${result.finishReason}`);
