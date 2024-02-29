import { IsNotEmpty } from "class-validator";
import { BannedMessagesHelper } from '../helpers/bannedmessages.helper';

export class BannedUserDto {
    
    @IsNotEmpty({message: BannedMessagesHelper.MEET_INVALID})
    meet: string;

    @IsNotEmpty({message: BannedMessagesHelper.USER_INVALID})
    userBannedId: string;
}