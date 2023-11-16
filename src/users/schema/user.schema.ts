import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ isRequired: true })
  username: string;

  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({ isRequired: false })
  phoneNumber: string;

  @Prop({ default: false })
  admin: boolean;

  @Prop()
  favorites: string[];

  @Prop()
  bought: object[];
}

export const UserSchema = SchemaFactory.createForClass(User);
