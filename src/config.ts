// src/config.ts
export const config = {
    // Layer 2: プロセス隔離（bubblewrap）
    sandbox: false,
    // Layer 3: アプリケーション層の設定
    allowedDomains: ['api.github.com', 'github.com', 'example.com'],
};
