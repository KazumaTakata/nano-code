import OpenAI from 'openai';
import {
    LLMApiError,
    type GenerateParams,
    type GenerateTextResult,
    type Message,
    type Provider,
    type ToolCall,
} from '../types';
import type { Chat, ChatCompletion } from 'openai/resources';

export const createOpenAI = (config?: {
    baseURL?: string;
    maxRetries?: number;
    apiKey?: string;
}): Provider => {
    const client = new OpenAI({
        baseURL: config?.baseURL || 'http://host.docker.internal:18000/v1',
        apiKey: config?.apiKey || 'dummy',
        maxRetries: config?.maxRetries ?? 0,
    });

    const convertMessages = (messages: Message[]) => {
        return messages.map((message) => {
            if (message.role === 'tool') {
                return {
                    role: 'tool' as const,
                    tool_call_id: message.toolCallId,
                    content: message.content,
                };
            }

            if (message.role === 'assistant' && message.toolCalls) {
                return {
                    role: 'assistant' as const,
                    content: message.content,
                    tool_calls: message.toolCalls.map((toolCall) => ({
                        id: toolCall.toolCallId,
                        type: 'function' as const,
                        function: {
                            name: toolCall.name,
                            arguments: JSON.stringify(toolCall.arguments),
                        },
                    })),
                };
            }

            return { role: message.role, content: message.content };
        });
    };

    const mapFinishReason = (
        reason: ChatCompletion.Choice['finish_reason'],
    ): GenerateTextResult['finishReason'] => {
        switch (reason) {
            case 'stop':
                return 'stop';
            case 'length':
                return 'length';
            case 'tool_calls':
                return 'tool_call';
            case 'content_filter':
                return 'content_filter';
            // case 'error':
            //     return 'error';
            default:
                return 'stop';
        }
    };

    return (modelId: string) => ({
        doGenerate: async (params: GenerateParams): Promise<GenerateTextResult> => {
            const tools = params.tools?.map((tool) => ({
                type: 'function' as const,
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters,
                },
            }));

            try {
                const response = await client.chat.completions.create(
                    {
                        model: modelId,
                        messages: convertMessages(params.messages),
                        temperature: params.temperature,
                        max_completion_tokens: params.maxTokens,
                        ...(tools && tools.length > 0 ? { tools } : {}),
                    },
                    {
                        signal: params.signal,
                    },
                );

                const choice = response.choices[0];

                if (!choice) {
                    throw new Error('No choices returned from LLM');
                }

                const message = choice.message;

                const toolCalls: ToolCall[] | undefined = message.tool_calls?.map((toolCall) => {
                    const funcType = toolCall.type;
                    if (funcType === 'function') {
                        return {
                            toolCallId: toolCall.id,
                            name: toolCall.function.name,
                            arguments: JSON.parse(toolCall.function.arguments),
                        };
                    }

                    throw new Error(`Unsupported tool call type: ${funcType}`);
                });

                return {
                    text: message.content ?? '',
                    finishReason: mapFinishReason(choice.finish_reason),
                    toolCalls,
                    usage: {
                        promptTokens: response.usage?.prompt_tokens,
                        completionTokens: response.usage?.completion_tokens,
                        totalTokens: response.usage?.total_tokens,
                    },
                };
            } catch (error: unknown) {
                if (error instanceof OpenAI.APIError) {
                    throw new LLMApiError(
                        error.status,
                        'local-llm',
                        error.code ?? undefined,
                        error.message,
                        error,
                    );
                }
                throw error;
            }
        },
    });
};
