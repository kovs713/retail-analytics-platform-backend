import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import {
  EmbeddingsModule,
  LLMModule,
  RagModule,
  VectorStoreModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RagModule,
    EmbeddingsModule,
    LLMModule,
    VectorStoreModule,
  ],
})
export class AppModule {}
