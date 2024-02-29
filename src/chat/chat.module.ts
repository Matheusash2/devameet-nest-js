import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { UserModule } from 'src/user/user.module';
import { MeetModule } from 'src/meet/meet.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [UserModule, MeetModule, MongooseModule.forFeature([
    {name: Chat.name, schema: ChatSchema}
  ])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, MongooseModule]
})
export class ChatModule {}
