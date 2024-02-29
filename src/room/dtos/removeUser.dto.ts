import { IsNotEmpty } from "class-validator";
import { RoomMessagesHelper } from "../helpers/roommessages.helper";


export class RemoveUserRoomDto {

    @IsNotEmpty({message: RoomMessagesHelper.JOIN_USER_NOT_VALID})
    clientId: string;
    
    @IsNotEmpty({message: RoomMessagesHelper.JOIN_USER_NOT_VALID})
    userId: string;

    @IsNotEmpty({message: RoomMessagesHelper.MEET_NOT_VALID})
    meetId: string;
}