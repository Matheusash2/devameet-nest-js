import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ChatMessagesHelper } from '../helpers/chatmessages.helper';

export class ChatDto {
    
    @IsNotEmpty({message: ChatMessagesHelper.MEET_INVALID})
    meet: string;

    @IsString()
    name: string;

    @IsString()
    avatar: string;

    @IsString()
    message: string;
}