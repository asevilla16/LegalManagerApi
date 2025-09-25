import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';
import { CasesModule } from './modules/cases/cases.module';
import { AuthModule } from './auth/auth.module';
import { LawfirmModule } from './modules/lawfirm/lawfirm.module';
import { CaseTypesModule } from './modules/case-types/case-types.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { CaseStatusModule } from './modules/case-status/case-status.module';
import { CourtTypeModule } from './modules/court-type/court-type.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule,
    CasesModule,
    AuthModule,
    LawfirmModule,
    CaseTypesModule,
    FilesModule,
    CaseStatusModule,
    CourtTypeModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
