import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Meet } from "./meet.schema";
import mongoose, { HydratedDocument } from "mongoose";

export type MeetObjectDocument = HydratedDocument<MeetObject>;

@Schema()
export class MeetObject{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Meet.name})
    meet: Meet;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    x: number;

    @Prop({required: true})
    y: number;

    @Prop({required: true})
    zindex: number;

    @Prop()
    orientation: string;
}

export const MeetObjectSchema = SchemaFactory.createForClass(MeetObject);