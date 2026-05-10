/**
 * sshで
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
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'What is the capital of France?' },
            ],
        }),
    });

    const data = await response.json();
    console.log(data);
}

callOpenAI();