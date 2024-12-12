import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "src/common/enums/roles.enum";
import { Types } from "mongoose";
import { timestamp } from "rxjs";
import { RuleTester } from "eslint";

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ required: false, type: timestamp })
  resetPasswordExpires?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
