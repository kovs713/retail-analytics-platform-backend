import { Embeddings } from '@langchain/core/embeddings';
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

export class XenovaEmbeddings extends Embeddings {
  private extractor: FeatureExtractionPipeline;

  constructor() {
    super({});
    void this.initializeExtractor();
  }

  private async initializeExtractor() {
    this.extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      { revision: 'default' },
    );
  }

  async embedQuery(text: string): Promise<number[]> {
    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data) as number[];
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const output = await this.extractor(text, {
        pooling: 'mean',
        normalize: true,
      });
      embeddings.push(Array.from(output.data) as number[]);
    }
    return embeddings;
  }
}
