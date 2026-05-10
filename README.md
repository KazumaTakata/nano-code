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

SSH ポートフォワーディングを行う

```sh
ssh -L 18000:localhost:11434 ssh-dgx.bita.jp
```

