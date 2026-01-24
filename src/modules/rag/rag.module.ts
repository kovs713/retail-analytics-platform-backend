import { RagController } from '@/api/rag/rag.controller';
import { EmbeddingsModule } from '@/modules/embeddings/embeddings.module';
import { LLMModule } from '@/modules/llm/llm.module';
import { RagService } from '@/modules/rag/rag.service';
import { VectorStoreModule } from '@/modules/vector-store/vector-store.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmbeddingsModule, LLMModule, VectorStoreModule],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
