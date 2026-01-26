import { ChromaDBClient } from '@/common/types/providers.type';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStoreService } from './vector-store.service';

@Module({})
export class VectorStoreModule {
  static forRootAsync(): DynamicModule {
    return {
      module: VectorStoreModule,
      providers: [
        {
          provide: ChromaDBClient,
          inject: [ConfigService, EmbeddingsService],
          useFactory(
            config: ConfigService,
            embeddingsService: EmbeddingsService,
          ) {
            const collectionName = config.get<string>('VECTOR_COLLECTION_NAME');
            const chromadbUrl = config.get<string>('CHROMADB_URL');

            const chromaStore = new Chroma(embeddingsService, {
              collectionName,
              url: chromadbUrl,
            });

            return chromaStore;
          },
        },

        VectorStoreService,
      ],
      exports: [VectorStoreService],
    };
  }
}
