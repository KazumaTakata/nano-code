/**
 * ssh port forwardingを使用して、ローカルのLLMにアクセスする際のURL
 */
const LOCAL_LLM_URL = 'http://host.docker.internal:18000/v1/chat/completions';

const callOpenAI = async () => {
    const response = await fetch(LOCAL_LLM_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            model: 'gpt-oss:20b',
            messages: [
                { role: 'user', content: 'Typescriptについて簡潔に説明してください' },
            ],
        }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

callOpenAI();