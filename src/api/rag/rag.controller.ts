import {
  Controller,
  Logger
} from '@nestjs/common';

@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);
}
