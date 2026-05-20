import { generateText } from '../src/core/generate-text'
import { createOpenAI } from '../src/providers/openai'
import { allTools } from '../src/tools/index'

const model = createOpenAI({
    apiKey: 'dummy-key', // llama-serverなのでdummy
    baseURL: 'http://host.docker.internal:18000/v1',
  })('gpt-oss:20b')


const result = await generateText({
  model,
  messages: [{
    role: 'user', content: 'TypeScriptについて教えてください'
  }],
  tools: allTools,
})

console.log(result.text)
