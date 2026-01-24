import { EmbeddingsModule } from '@/domains/rag/embeddings/embeddings.module';
import { Module } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';

@Module({
  imports: [EmbeddingsModule],
  providers: [VectorStoreService],
  exports: [VectorStoreService],
})
export class VectorStoreModule {}
