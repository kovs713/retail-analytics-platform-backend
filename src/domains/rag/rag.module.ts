import { RagController } from '@/api/rag/rag.controller';
import { EmbeddingsModule } from '@/domains/rag/embeddings/embeddings.module';
import { LLMModule } from '@/domains/rag/llm/llm.module';
import { RagService } from '@/domains/rag/rag.service';
import { VectorStoreModule } from '@/domains/rag/vector-store/vector-store.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmbeddingsModule, LLMModule, VectorStoreModule],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
