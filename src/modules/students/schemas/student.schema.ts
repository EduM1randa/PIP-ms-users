import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Student {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  names?: string;

  @Prop({ required: true })
  lastNames?: string;

  @Prop({ required: true })
  rut?: string;

  @Prop({ required: true })
  birthday?: Date;

  @Prop({ required: true })
  address?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "Parent" }],
    required: false,
    max: 2,
  })
  parents?: Types.ObjectId[];

  @Prop({ required: true })
  courseId?: Types.ObjectId;

  @Prop({ required: false, default: [] })
  medicalObservations?: string[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
