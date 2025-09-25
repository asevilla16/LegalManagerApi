import { Test, TestingModule } from '@nestjs/testing';
import { LawfirmController } from './lawfirm.controller';
import { LawfirmService } from './lawfirm.service';

describe('LawfirmController', () => {
  let controller: LawfirmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawfirmController],
      providers: [LawfirmService],
    }).compile();

    controller = module.get<LawfirmController>(LawfirmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
