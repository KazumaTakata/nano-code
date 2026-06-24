
FROM oven/bun:1.3

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
    sudo \
    openssh-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


RUN useradd -ms /bin/bash vscode
RUN usermod -aG sudo vscode \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode



USER vscode
WORKDIR /nano-code

ENV DEVCONTAINER=true
# Claude Code (native installer) は ~/.local/bin に入る
ENV PATH="/home/vscode/.local/bin:/home/vscode/.bun/bin:$PATH"

ENV BUN_INSTALL_CACHE_DIR="/home/vscode/.bun-cache"
RUN mkdir -p ${BUN_INSTALL_CACHE_DIR}

# Claude Code CLI（スタンドアロン・バイナリ / Node 不要）
RUN curl -fsSL https://claude.ai/install.sh | bash

CMD [ "bash" ]
