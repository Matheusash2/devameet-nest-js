import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Meet } from 'src/meet/schemas/meet.schema';
import { Position } from 'src/room/schemas/position.schema';
import { User } from 'src/user/schemas/user.schema';

export type BannedDocument = HydratedDocument<Banned>;

@Schema()
export class Banned {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Meet.name, required: true })
  meet: Meet;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Position.name, required: true })
  userBanned: Position;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Position.name, required: true })
  userBannedId: Position;

  @Prop({ type: mongoose.Schema.Types.String, ref: Position.name, required: true })
  userBannedName: Position;

  @Prop({ type: mongoose.Schema.Types.String, ref: Position.name, required: true })
  userBannedAvatar: Position;
}

export const BannedSchema = SchemaFactory.createForClass(Banned);
