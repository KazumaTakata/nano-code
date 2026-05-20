import { readFile } from '../src/tools/readFile';
import { writeFile } from '../src/tools/writeFile';
import { editFile } from '../src/tools/editFile';
import { execCommand } from '../src/tools/execCommand';

async function demo() {
  console.log('===ツール動作確認===');

  // writeFile
  console.log('writeFile: テキストファイル作成');
  const writeResult = await writeFile.execute({
    path: 'test.txt',
    content: 'Hello from nano-code!\nThis is a test file.',
  })
  console.log(`writeFile: 結果: ${writeResult}\n`);


  // readFile
  console.log('readFile: ファイル読み込み');
  const content = await readFile.execute({
    path: 'test.txt',
  });
  console.log(`readFile: 内容\n${content.replace(/\n/g, '\n')}\n`);

  // editFIle
  console.log('editFile: ファイル一部編集');
  const editResult = await editFile.execute({
    path: 'test.txt',
    oldText: 'Hello from nano-code!',
    newText: 'Hello from nano-code-agent',
  })
  console.log(`editFile: 結果 ${editResult}\n`)

  // readFile
  console.log('readFile: 編集後のファイルを確認');
  const editedContent = await readFile.execute({
    path: 'test.txt',
  });
  console.log(`readFile: 内容\n${editedContent.replace(/\n/g, '\n')}\n`);

  // execCommand
  console.log('execCommand: ワークスペースファイル一覧取得');
  const lsResult = await execCommand.execute({
    command: 'ls -la'
  });
  console.log(`execCommand: 結果\n${lsResult}\n`);

  // readFile
  console.log('readFile: エラーケース 存在しないファイルの読み込み');
  try {
    await readFile.execute({
      path: 'nonexistent.txt',
    })
  } catch(error) {
    if (error instanceof Error) {
      console.log(`readFile: 期待通りのエラー${error.message}\n`)
    } else {
      console.log(error)
    }
  }

  // readFile
  console.log('readFile: セキュリティチェック ワークスペース外へのアクセス');
  try {
    await readFile.execute({
      path: '../.env',
    })
  } catch(error) {
    if (error instanceof Error) {
      console.log(`readFile: 期待通りのエラー${error.message}\n`)
    } else {
      console.log(error)
    }
  }

  console.log('===動作確認終了===');
}

demo().catch(console.error);
