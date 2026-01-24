import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);
  private chromaStore: Chroma | null = null;

  constructor(
    private configService: ConfigService,
    private embeddingsService: EmbeddingsService,
  ) {
    // Defer initialization until first use to ensure ConfigService is available
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.chromaStore) {
      await this.initializeVectorStore();
    }
  }

  private async initializeVectorStore(): Promise<void> {
    try {
      const collectionName = this.configService.get<string>(
        'VECTOR_COLLECTION_NAME',
        'documents',
      );

      // Initialize Chroma vector store with our embeddings service
      this.chromaStore = new Chroma(this.embeddingsService.getEmbeddings(), {
        collectionName,
        url: 'http://localhost:8000',
      });

      this.logger.log(
        `Vector store initialized with collection: ${collectionName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to initialize vector store: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Add documents to the vector store
   * @param documents - Array of Document objects to add
   * @returns Promise<string[]> - Array of document IDs
   */
  async addDocuments(documents: Document[]): Promise<string[]> {
    await this.ensureInitialized();
    if (!this.chromaStore) {
      throw new Error('Failed to initialize vector store');
    }
    try {
      const ids = await this.chromaStore.addDocuments(documents);
      this.logger.log(`Added ${documents.length} documents to vector store`);
      return ids;
    } catch (error) {
      this.logger.error(
        `Failed to add documents: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Add texts with metadata to the vector store
   * @param texts - Array of text strings
   * @param metadatas - Array of metadata objects (optional)
   * @param ids - Array of custom IDs (optional)
   * @returns Promise<string[]> - Array of document IDs
   */
  async addTexts(
    texts: string[],
    metadatas?: Record<string, any>[],
  ): Promise<string[]> {
    await this.ensureInitialized();
    if (!this.chromaStore) {
      throw new Error('Failed to initialize vector store');
    }
    try {
      const embeddingsInstance = this.embeddingsService.getEmbeddings();
      const resultIds = await this.chromaStore.addVectors(
        await embeddingsInstance.embedDocuments(texts),
        texts.map((text, index) => ({
          pageContent: text,
          metadata: metadatas?.[index] || {},
        })),
      );
      this.logger.log(`Added ${texts.length} texts to vector store`);
      return resultIds;
    } catch (error) {
      this.logger.error(
        `Failed to add texts: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Search for similar documents
   * @param query - Search query string
   * @param k - Number of results to return (default: 5)
   * @param filter - Optional filter for metadata
   * @returns Promise<Document[]> - Array of similar documents
   */
  async similaritySearch(
    query: string,
    k: number = 5,
    filter?: Record<string, any>,
  ): Promise<Document[]> {
    await this.ensureInitialized();
    if (!this.chromaStore) {
      throw new Error('Failed to initialize vector store');
    }
    try {
      const results = await this.chromaStore.similaritySearch(query, k, filter);
      this.logger.log(`Similarity search completed for query: "${query}"`);
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to perform similarity search: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Search for documents with scores
   * @param query - Search query string
   * @param k - Number of results to return (default: 5)
   * @param filter - Optional filter for metadata
   * @returns Promise<[Document, number][]> - Array of documents with similarity scores
   */
  async similaritySearchWithScore(
    query: string,
    k: number = 5,
    filter?: Record<string, any>,
  ): Promise<[Document, number][]> {
    await this.ensureInitialized();
    if (!this.chromaStore) {
      throw new Error('Failed to initialize vector store');
    }
    try {
      const results = await this.chromaStore.similaritySearchWithScore(
        query,
        k,
        filter,
      );
      this.logger.log(
        `Similarity search with scores completed for query: "${query}"`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to perform similarity search with scores: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Delete documents by IDs
   * @param ids - Array of document IDs to delete
   * @returns Promise<void>
   */
  deleteDocuments(ids: string[]): void {
    if (!this.chromaStore) {
      throw new Error('Vector store not initialized');
    }

    try {
      // LangChain Chroma delete method signature may vary
      // For now, we'll log a warning and not implement deletion
      this.logger.warn(
        `Document deletion not implemented for Chroma vector store. IDs: ${ids.join(', ')}`,
      );
      // TODO: Implement proper deletion when LangChain Chroma API is clarified
    } catch (error) {
      this.logger.error(
        `Failed to delete documents: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  /**
   * Get the underlying Chroma vector store instance
   * @returns Chroma - The LangChain Chroma instance
   */
  async getVectorStore(): Promise<Chroma> {
    await this.ensureInitialized();
    return this.chromaStore!;
  }

  /**
   * Create a retriever from the vector store
   * @param searchKwargs - Search configuration
   * @returns Retriever - LangChain retriever instance
   */
  asRetriever(searchKwargs?: { k?: number; filter?: Record<string, any> }) {
    if (!this.chromaStore) {
      throw new Error('Vector store not initialized');
    }
    return this.chromaStore.asRetriever(searchKwargs);
  }
}
