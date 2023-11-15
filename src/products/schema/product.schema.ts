import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  size: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  color: string[];

  @Prop()
  quota: string;

  @Prop()
  quotaPrice: string;

  @Prop()
  discount: string;

  @Prop({ default: true })
  available: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
