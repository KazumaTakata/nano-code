import type { GenerateParams, LanguageModel } from '../types';

type GenerateTextParams = GenerateParams & {
    model: LanguageModel;
};

export const generateText = async (params: GenerateTextParams) => {
    const { model, ...generateParams } = params;
    return await model.doGenerate(generateParams);
};
