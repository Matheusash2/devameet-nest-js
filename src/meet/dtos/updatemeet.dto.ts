import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { CreateMeetDto } from "./createmeet.dto";
import { MeetMessagesHelper } from "../helpers/meetmessages.helper";
import { Type } from "class-transformer";


export class UpdateMeetDto extends CreateMeetDto {

    @IsArray({message: MeetMessagesHelper.UPDATE_OBJECT_NAME_NOT_VALID})
    @Type(() => UpdateMeetObjectDto)
    @ValidateNested({each: true})
    objects: Array<UpdateMeetObjectDto>
}

export class UpdateMeetObjectDto {
    
    @IsNotEmpty({message: MeetMessagesHelper.UPDATE_OBJECT_NAME_NOT_VALID})
    name: string;

    @IsNumber({}, {message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    x: number;

    @IsNumber({}, {message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    y: number;

    @IsNumber({}, {message: MeetMessagesHelper.UPDATE_ZINDEX_NOT_VALID})
    zindex: number;

    @IsString({message: MeetMessagesHelper.UPDATE_ORIENTATION_NOT_VALID})
    orientation: string

    @IsBoolean({message: MeetMessagesHelper.UPDATE_WALKABLE_NOT_VALID})
    walkable: boolean

    @IsNumber({}, {message: MeetMessagesHelper.UPDATE_WIDTH_AND_HEIGHT_NOT_VALID})
    width: number

    @IsNumber({}, {message: MeetMessagesHelper.UPDATE_WIDTH_AND_HEIGHT_NOT_VALID})
    height: number
}