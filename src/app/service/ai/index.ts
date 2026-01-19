import OpenAI from 'openai'

const apiKey = (process.env.OPENAI_API_KEY as string) ?? ''
const model = (process.env.OPENAI_MODEL as string) ?? ''

export const client = new OpenAI({
    apiKey,
})

export async function parseMessage(message: string) {
    const response = await client.responses.create({
        model: model,
        input: [
            {
                role: 'developer',
                content: `
You are an API.
Return ONLY valid JSON.
NO explanation.
NO markdown.

Format:
{
  "name": string,
  "price": number,
  "size": string
}
        `.trim(),
            },
            {
                role: 'user',
                content: message,
            },
        ],
    })

    const text = response.output_text

    console.log('AI RAW:', text)

    if (!text) {
        throw new Error('No output text from OpenAI')
    }

    try {
        return JSON.stringify(text)
    } catch {
        throw new Error('Invalid JSON returned by OpenAI: ' + text)
    }
}
