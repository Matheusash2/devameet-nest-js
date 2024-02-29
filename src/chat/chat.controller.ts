import { Body, Controller, Post, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dtos/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}

    @Post()
    async creteChatMessage(@Request() req, @Body() dto: ChatDto){
        const {userId} = req?.user;
        return await this.chatService.createMessage(userId, dto);
    }
}
