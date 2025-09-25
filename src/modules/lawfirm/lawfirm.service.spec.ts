import { Test, TestingModule } from '@nestjs/testing';
import { LawfirmService } from './lawfirm.service';

describe('LawfirmService', () => {
  let service: LawfirmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LawfirmService],
    }).compile();

    service = module.get<LawfirmService>(LawfirmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
