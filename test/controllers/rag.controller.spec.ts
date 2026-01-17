import { RagController } from '@/api/rag/rag.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('RagController', () => {
  let controller: RagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RagController],
    }).compile();

    controller = module.get<RagController>(RagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
