import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schemas/student.schema';
import { UserModule } from '../user/user.module';
import { SubjectsModule } from 'src/common/connections/subjects.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ 
      name: 'Student', 
      schema: StudentSchema 
    }]),
    SubjectsModule,
    UserModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
