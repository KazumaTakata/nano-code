// 第6章 6.5「コンテキスト管理の実装」のハンズオン挙動確認。
//
// 確認すること:
//   - Agent.manageContext が CHAR_LIMIT(30,000文字) を超えた会話履歴を圧縮すること。
//   - 戦略A: 古いツール実行結果（200文字超）を「省略」文字列に置換すること。
//   - 戦略B: それでも溢れる場合は中間メッセージを古い順に削除すること。
//   - システムプロンプトと直近4メッセージは保護されること。
//
// LLM不要・決定的なデモ（manageContext は private のため検証用に as any で呼び出す）。
// 実行: bun chapters/06-5-manage-context.ts

import { Agent } from '../src/core/agent';
import type { LanguageModel, Message } from '../src/types';

// manageContext は LLM を呼ばないので、ダミーモデルで十分
const dummyModel: LanguageModel = {
    doGenerate: async () => ({ text: '', finishReason: 'stop' as const }),
};

const agent = new Agent({
    name: 'context-demo',
    instructions: 'あなたはコーディングエージェントです。',
    model: dummyModel,
    tools: {},
});

// 合計30,000文字を超える会話履歴を合成する
const bigCode = 'x'.repeat(25000); // readFile が読んだ巨大ファイルを想定
const messages: Message[] = [
    { role: 'system', content: 'システムプロンプト（保護対象）' },
    { role: 'user', content: 'calculator.ts を読んでテストを追加して' },
    { role: 'assistant', content: 'まず calculator.ts を読み込みます', toolCalls: [] },
    // 古い巨大なツール結果（戦略Aで省略されるはず）
    { role: 'tool', content: bigCode, toolCallId: 'c1', name: 'readFile' },
    { role: 'assistant', content: '内容を確認しました', toolCalls: [] },
    { role: 'tool', content: 'y'.repeat(6000), toolCallId: 'c2', name: 'readFile' },
    // 直近4メッセージ（保護対象）
    { role: 'assistant', content: 'テストを作成します', toolCalls: [] },
    { role: 'tool', content: '小さな結果', toolCallId: 'c3', name: 'writeFile' },
    { role: 'assistant', content: 'テストを実行します', toolCalls: [] },
    { role: 'tool', content: '3 pass', toolCallId: 'c4', name: 'execCommand' },
];

const lengthOf = (msgs: Message[]) => msgs.reduce((sum, m) => sum + m.content.length, 0);

const dump = (label: string, msgs: Message[]) => {
    console.log(`\n=== ${label} (合計 ${lengthOf(msgs)}文字, ${msgs.length}件) ===`);
    msgs.forEach((m, i) => {
        const preview = m.content.length > 40 ? m.content.slice(0, 40) + '…' : m.content;
        console.log(`  [${i}] role=${m.role} len=${m.content.length} : ${preview}`);
    });
};

dump('圧縮前', messages);

// private メソッドを検証目的で呼び出す
const compressed = (agent as any).manageContext(messages) as Message[];

dump('圧縮後', compressed);

console.log('\n=== 確認ポイント ===');
console.log(`先頭がシステムプロンプトのまま: ${compressed[0]?.role === 'system'}`);
console.log(`合計が CHAR_LIMIT(30000) 以下: ${lengthOf(compressed) <= 30000}`);
console.log(
    `古い巨大ツール結果が省略された: ${compressed.some((m) => m.content.includes('省略されました'))}`,
);
