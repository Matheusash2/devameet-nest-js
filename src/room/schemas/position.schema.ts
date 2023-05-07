import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Meet } from "src/meet/schemas/meet.schema";
import { User } from "src/user/schemas/user.schema";

export type PositionDocument = HydratedDocument<Position>;

@Schema()
export class Position {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Meet.name})
    meet: Meet;
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    user: User;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    avatar: string;
    
    @Prop({required: true})
    clientId: string;

    @Prop({required: true})
    x: number;

    @Prop({required: true})
    y: number;

    @Prop({required: true})
    orientation: string;

    @Prop({default: false})
    muted: boolean;
}

export const PositionSchema = SchemaFactory.createForClass(Position);