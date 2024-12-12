import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "src/common/enums/roles.enum";
import { Types } from "mongoose";
import { timestamp } from "rxjs";
import { RuleTester } from "eslint";

export type UserDocument = HydratedDocument<Teacher>;

@Schema()
export class Teacher {
  _id!: Types.ObjectId;
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  email!: string;
  /*En caso de que un padre sea profesor, el admin se responsabilizará que al tener el mismo correo
  Los datos sean iguales. La repetición del correo solo se verá en la tabla*/

  @Prop({ required: false, default: []})
  subjects!: string[]; //Acá estarán las ID de las asignaturas ඞ

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ required: false, type: timestamp })
  resetPasswordExpires?: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
