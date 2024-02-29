import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { ChatDto } from "./dtos/chat.dto";

@WebSocketGateway({cors: true})
export class ChatGateway {

    constructor(private readonly chatService: ChatService,){}

    @WebSocketServer() server: Server;

    private logger = new Logger(ChatGateway.name)

    @SubscribeMessage('chat-message')
    async handleChatMessage(client: Socket, user: string, payload: ChatDto){
        this.logger.debug(`chat-message: ${client.id}`);
        const { meet, name, avatar, message } = payload;
        const userId = user;

        const dto = {
            meet,
            name,
            avatar,
            message
        } as ChatDto;

        await this.chatService.createMessage(userId, dto);    
        this.server.emit('chat-message', message);
        client.broadcast.emit('chat-message', {user: client.id});
    }
}