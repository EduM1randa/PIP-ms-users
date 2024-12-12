import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from './modules/email/email.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `${(process.env.MONGODB_URI_BASE || '').replace(
        "@",
        `${process.env.DB_PASSWORD}@`,
      )}`,
    ),
    UserModule,
    AuthModule,
    EmailModule,
    StudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
