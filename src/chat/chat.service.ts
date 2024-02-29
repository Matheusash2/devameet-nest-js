import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dtos/chat.dto';
import { ChatMessagesHelper } from './helpers/chatmessages.helper';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>
    ){}

    async createMessage(userId: string, dto: ChatDto){
        try {
            this.logger.debug('createMessage' + userId);
            const user = await this.userModel.findById(userId);

            if(!user) {
                throw new BadRequestException(ChatMessagesHelper.USER_NOT_FOUND);
            }

            const message = {
                user,
                ...dto
              };
        
              const createdBanned = new this.chatModel(message);
              await createdBanned.save();
              this.logger.log(
                `Usuário ${dto.name} criou mensagem com sucesso na sala.`,
              );
              return { message: ChatMessagesHelper.SUCESS_CREATE_MESSAGE };
        } catch (error) {
            this.logger.error(`Erro ao criar mensagem no chat: ${error.message}`);
            throw error;
        }
    }

    async getMessages(meet: string){
        try {
            this.logger.debug(`getMessageChat - ${meet}`);
            const messages = await this.chatModel.find({ meet });
            return messages;
        } catch (error) {
            this.logger.error(`Erro ao criar buscar mensagens no chat: ${error.message}`);
            throw error;  
        }
    }
}
