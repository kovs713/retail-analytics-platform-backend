import { Module } from '@nestjs/common';
import * as modules from '../modules';
import { RagController } from './rag/rag.controller';

@Module({
  imports: Object.values(modules),
  controllers: [RagController],
})
export class ApiModule {}
