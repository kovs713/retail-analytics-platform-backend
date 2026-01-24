import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private llm: ChatGroq | null = null;

  constructor(private configService: ConfigService) {
    // Defer initialization until first use to ensure ConfigService is available
  }

  private ensureInitialized(): void {
    if (!this.llm) {
      this.initializeLLM();
    }
  }

  private initializeLLM(): void {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const model = this.configService.get<string>(
      'GROQ_MODEL',
      'llama-3.3-70b-versatile',
    );
    const temperature = parseFloat(
      this.configService.get<string>('GROQ_TEMPERATURE', '0.7'),
    );

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    this.llm = new ChatGroq({
      apiKey,
      model,
      temperature,
    });

    this.logger.log(`LLM service initialized with model: ${model}`);
  }

  /**
   * Generate text response from a single prompt
   * @param prompt - The input prompt
   * @param systemMessage - Optional system message to set context
   * @returns Promise<string> - The generated response
   */
  async generateText(prompt: string, systemMessage?: string): Promise<string> {
    this.ensureInitialized();
    if (!this.llm) {
      throw new Error('Failed to initialize LLM service');
    }

    try {
      const messages = systemMessage
        ? [new SystemMessage(systemMessage), new HumanMessage(prompt)]
        : [new HumanMessage(prompt)];

      const response = await this.llm.invoke(messages);
      return response.content as string;
    } catch (error) {
      this.logger.error(
        `Failed to generate text: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Generate text response with custom messages
   * @param messages - Array of messages (HumanMessage, SystemMessage, etc.)
   * @returns Promise<string> - The generated response
   */
  async generateWithMessages(
    messages: (HumanMessage | SystemMessage)[],
  ): Promise<string> {
    this.ensureInitialized();
    if (!this.llm) {
      throw new Error('Failed to initialize LLM service');
    }

    try {
      const response = await this.llm.invoke(messages);
      return response.content as string;
    } catch (error) {
      this.logger.error(
        `Failed to generate with messages: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Get the underlying ChatGroq instance for advanced usage
   * @returns Promise<ChatGroq> - The LangChain ChatGroq instance
   */
  getLLM(): ChatGroq {
    this.ensureInitialized();
    if (!this.llm) {
      throw new Error('Failed to initialize LLM service');
    }
    return this.llm;
  }
}
