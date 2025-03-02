import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './common/global.module';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GlobalModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
