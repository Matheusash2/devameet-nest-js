import { IsBoolean } from "class-validator";
import { JoinRoomDto } from "./joinroom.dto";
import { RoomMessagesHelper } from "../helpers/roommessages.helper";


export class ToglMuteDto extends JoinRoomDto {

    @IsBoolean({message: RoomMessagesHelper.MUTE_NOT_VALID})
    muted: boolean;
}