# /nano-code

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.13. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


# spark dgxで動かす場合

LLM は DGX 上の Ollama を SSH ポートフォワーディング経由で使う。

ホスト（あなたのマシン）でトンネルを張る:

```sh
ssh -L 18000:localhost:11434 ssh-dgx.bita.jp
```

ホスト上で直接エージェントを動かす場合はこれで OK（`src/providers/openai.ts` の baseURL は `host.docker.internal:18000` を向いているため、Dev Container 利用時は下記の注意を参照）。

# Dev Container で動かす場合

`.devcontainer/` を用意してある。VS Code の「Reopen in Container」（または `devcontainer up`）で起動する。コンテナには以下が入る:

- Bun ランタイム（`oven/bun:1.3`）
- Claude Code CLI（`claude`） … 初回のみ `claude login` で認証する
- nano-code 用の既定 env（`LLM_PROVIDER=openai`, `LLM_MODEL=gpt-oss:20b`）

## LLM への到達（重要）

nano-code エージェントはコンテナ内から `http://host.docker.internal:18000/v1` に接続する。

- `devcontainer.json` の `--add-host=host.docker.internal:host-gateway` により、Linux でも `host.docker.internal` が解決される。
- ただしコンテナ（docker gateway 経由）からホストのトンネルへ届かせるには、ホスト側のトンネルをループバックではなく全 IF（または bridge IP）にバインドする:

```sh
# ホスト側で実行（0.0.0.0 にバインド）
ssh -L 0.0.0.0:18000:localhost:11434 ssh-dgx.bita.jp
# セキュリティを絞るなら docker bridge IP を指定:
# ssh -L 172.17.0.1:18000:localhost:11434 ssh-dgx.bita.jp
```

接続確認（コンテナ内）:

```sh
curl -s http://host.docker.internal:18000/v1/models
```

## エージェント実行（コンテナ内）

```sh
# 既定 env を使う場合（LLM_MODEL は DGX で pull 済みのモデルに合わせる）
bun run agent "workspace に hello.ts を作って"

# env を都度指定する場合
LLM_PROVIDER=openai LLM_MODEL=gpt-oss:20b bun run agent "<タスク>"
```

> メモ: コンテナ内でトンネルを張りたい場合は `openssh-client` を同梱済みなので
> `ssh -L 18000:localhost:11434 ssh-dgx.bita.jp` を実行できるが、その際は
> baseURL が `localhost:18000` になるためソース側の調整が必要（既定はホスト側トンネル運用）。

