import { RagController } from '@/api/rag/rag.controller';
import { AppLogger } from '@/common/logger/app-logger.service';
import { EmbeddingsModule } from '@/domains/rag/embeddings/embeddings.module';
import { LLMModule } from '@/domains/rag/llm/llm.module';
import { RagService } from '@/domains/rag/rag.service';
import { VectorStoreModule } from '@/domains/rag/vector-store/vector-store.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EmbeddingsModule.forRootAsync(),
    LLMModule,
    VectorStoreModule.forRootAsync(),
  ],
  controllers: [RagController],
  providers: [RagService, AppLogger],
  exports: [RagService],
})
export class RagModule {}
