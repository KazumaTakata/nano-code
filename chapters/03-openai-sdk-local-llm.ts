import OpenAI from 'openai';

/**
 * ssh port forwardingを使用して、ローカルのLLMにアクセスする際のURL
 */
const LOCAL_LLM_BASE_URL = 'http://host.docker.internal:18000/v1';

const callOpenAI = async () => {
    const client = new OpenAI({
        baseURL: LOCAL_LLM_BASE_URL,
        /**
         * ローカルのLLMはAPIキーを必要としないため、ダミーの値を設定しています。
         */
        apiKey: 'dummy',
        maxRetries: 0,
    });

    const completion = await client.chat.completions.create({
        model: 'gpt-oss:20b',
        messages: [{ role: 'user', content: 'Typescriptについて簡潔に説明してください' }],
    });

    console.log(JSON.stringify(completion, null, 2));
};

callOpenAI();
