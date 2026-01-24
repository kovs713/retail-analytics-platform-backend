import { Embeddings } from '@langchain/core/embeddings';
import { Injectable, Logger } from '@nestjs/common';
import { XenovaEmbeddings } from './xenovaEmbeddings.impl';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private embeddingsInstance: XenovaEmbeddings | null = null;

  constructor() {
    void this.initializeEmbeddings();
  }

  private initializeEmbeddings() {
    try {
      this.embeddingsInstance = new XenovaEmbeddings();
      this.logger.log(
        'Embeddings service initialized with Xenova Transformers',
      );
    } catch (error) {
      this.logger.error('Failed to initialize embeddings:', error);
      throw error;
    }
  }

  /**
   * Embed a single query string
   * @param text - The text to embed
   * @returns Promise<number[]> - The embedding vector
   */
  async embedQuery(text: string): Promise<number[]> {
    try {
      if (!this.embeddingsInstance) {
        this.initializeEmbeddings();
      }
      if (!this.embeddingsInstance) {
        throw new Error('Embeddings instance not initialized');
      }
      return await this.embeddingsInstance.embedQuery(text);
    } catch (error) {
      this.logger.error(
        `Failed to embed query: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Embed multiple documents
   * @param texts - Array of texts to embed
   * @returns Promise<number[][]> - Array of embedding vectors
   */
  async embedDocuments(texts: string[]): Promise<number[][]> {
    try {
      if (!this.embeddingsInstance) {
        this.initializeEmbeddings();
      }
      if (!this.embeddingsInstance) {
        throw new Error('Embeddings instance not initialized');
      }
      return await this.embeddingsInstance.embedDocuments(texts);
    } catch (error) {
      this.logger.error(
        `Failed to embed documents: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Get the LangChain-compatible embeddings instance
   * @returns Promise<Embeddings> - Compatible with LangChain
   */
  getEmbeddings(): Embeddings {
    if (!this.embeddingsInstance) {
      this.initializeEmbeddings();
    }
    return this.embeddingsInstance!;
  }
}
