import OpenAI from 'openai';

interface Notecard {
  title: string;
  content: string;
}

interface OpenAIResponse {
  notecards: Notecard[];
}

export class OpenAIService {
  private static instance: OpenAI;

  private static getInstance(): OpenAI {
    if (!this.instance) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log('API Key present:', !!apiKey);
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }
      this.instance = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }
    return this.instance;
  }

  static async generateNotecards(articleContent: string, maxCards: number = 10): Promise<Notecard[]> {
    console.log('Generating notecards for article length:', articleContent.length);
    
    try {
      const openai = this.getInstance();
      
      const prompt = `
        Analyze the following Wikipedia article content and break it down into ${maxCards} key concepts or ideas.
        Each concept should be self-contained and atomic (focused on a single idea).
        Format your response as a JSON object with a 'notecards' array containing objects with 'title' and 'content' properties.
        
        Example format:
        {
          "notecards": [
            {
              "title": "First Concept Title",
              "content": "First concept explanation"
            },
            {
              "title": "Second Concept Title",
              "content": "Second concept explanation"
            }
          ]
        }

        Article content:
        ${articleContent.substring(0, 4000)}
      `;

      console.log('Sending request to OpenAI...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that breaks down complex articles into simple, atomic concepts. Always respond with valid JSON in the specified format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      console.log('Received response from OpenAI');

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      console.log('Raw OpenAI response:', content);

      try {
        const parsedContent = JSON.parse(content) as OpenAIResponse;
        if (!parsedContent.notecards || !Array.isArray(parsedContent.notecards)) {
          console.error('Invalid response format. Expected object with notecards array, got:', parsedContent);
          throw new Error('Response does not contain a notecards array');
        }
        
        // Validate each notecard
        for (const card of parsedContent.notecards) {
          if (!card.title || !card.content) {
            throw new Error('Invalid notecard format: missing title or content');
          }
        }
        
        console.log(`Generated ${parsedContent.notecards.length} notecards`);
        return parsedContent.notecards;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
        console.error('Failed to parse OpenAI response. Raw content:', content);
        throw new Error(`Failed to parse OpenAI response: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error in generateNotecards:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate notecards: ${error.message}`);
      }
      throw new Error('Failed to generate notecards: Unknown error');
    }
  }
} 