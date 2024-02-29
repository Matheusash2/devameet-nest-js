import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Meet } from 'src/meet/schemas/meet.schema';
import { User } from 'src/user/schemas/user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: User.name,required: true})
  user: User;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Meet.name, required: true})
  meet: Meet;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
