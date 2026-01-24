import { Embeddings } from '@langchain/core/embeddings';
import { Injectable, Logger } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

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

// Custom Xenova embeddings class implementing LangChain Embeddings interface
class XenovaEmbeddings extends Embeddings {
  private extractor: any = null;

  constructor() {
    super({});
    void this.initializeExtractor();
  }

  private async initializeExtractor() {
    try {
      this.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );
    } catch (error) {
      console.error('Failed to initialize extractor:', error);
      throw error;
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    if (!this.extractor) {
      await this.initializeExtractor();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return Array.from(output.data);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!this.extractor) {
      await this.initializeExtractor();
    }

    const embeddings: number[][] = [];
    for (const text of texts) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const output = await this.extractor(text, {
        pooling: 'mean',
        normalize: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      embeddings.push(Array.from(output.data));
    }
    return embeddings;
  }
}
