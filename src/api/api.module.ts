import * as domainModules from '@/domains/index';
import { Module } from '@nestjs/common';
import { RagController } from './rag/rag.controller';

@Module({
  imports: Object.values(domainModules),
  controllers: [RagController],
})
export class ApiModule {}
