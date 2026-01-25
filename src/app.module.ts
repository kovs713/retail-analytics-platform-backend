import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import {
  EmbeddingsModule,
  LLMModule,
  RagModule,
  VectorStoreModule,
} from './domains';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // Rag domain modules
    RagModule,
    EmbeddingsModule.forRootAsync(),
    LLMModule,
    VectorStoreModule,
  ],
})
export class AppModule {}
