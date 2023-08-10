import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { Position, PositionDocument } from './schemas/position.schema';


type ActiveSocketType = {
  room: string;
  id: string;
  userId: string
};

@WebSocketGateway({cors: true})
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect{
  
  constructor(private readonly service: RoomService,
    @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>,
    @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>){}

  @WebSocketServer() wss: Server;

  private logger = new Logger(RoomGateway.name);

  private activeSockets: ActiveSocketType[] = [];
  
  async handleDisconnect(client: any) {
    const existingOnSocket = this.activeSockets.find(
      socket => socket.id === client.id
    );

    if(!existingOnSocket) return;

    // Recupera o documento Meet correspondente
    const meet = await this.meetModel.findOne({ link: existingOnSocket.room });
    
    this.activeSockets = this.activeSockets.filter(
      socket => socket.id !== client.id
    );

    // Passa o documento Meet para o método deleteUsersPosition
    await this.service.deleteUsersPosition(client.id, meet);
    client.broadcast.emit(`${existingOnSocket.room}-remove-user`, {socketId: client.id});

    this.logger.debug(`Cliente: ${client.id} disconnected`);
  }

  afterInit(server: any) {
    this.logger.log('Gateway initialized');
  }

  @SubscribeMessage('join')
  async handleJoin (client: Socket, payload: JoinRoomDto){
    const {link, userId} = payload;

    const existingOnSocket = this.activeSockets.find(
      (socket) => socket.room === link && socket.id === client.id);

      if(!existingOnSocket){
        this.activeSockets.push({room: link, id: client.id, userId});
        
        // Verificar se o usuário já tem uma posição registrada para a sala
        const existingPosition = await this.service.getUserPosition(
          userId, 
          link
          );

      if(existingPosition){
        // Obtenha os valores da posição existente
        const { x, y, orientation } = existingPosition; 

          const dto = {
            link,
            userId,
            x,
            y,
            orientation,
          } as UpdateUserPositionDto;

        // Atualize a posição atual do usuário
        await this.service.updateUserPosition(client.id, dto);
          
      }else{
        // Caso contrário, gera uma nova posição aleatória
        const positionX = Math.floor(Math.random() * 9); // Valores de 0 a 8
        const positionY = Math.floor(Math.random() * 9); // Valores de 0 a 8
          
          const dto = {
            link,
            userId,
            x: positionX,
            y: positionY,
            orientation: 'front'
          } as UpdateUserPositionDto
      
        // Armazena a posição atual do usuário
        await this.service.updateUserPosition(client.id, dto);
      }
        const users = await this.service.listUsersPositionByLink(link);

        this.wss.emit(`${link}-update-user-list`, {users});
        client.broadcast.emit(`${link}-add-user`, {user: client.id});

      }

      this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
  }

  @SubscribeMessage('move')
  async handleMove (client: Socket, payload: UpdateUserPositionDto){
    const {link, userId, x, y, orientation} = payload;
    const dto = {
      link,
      userId,
      x,
      y,
      orientation
    } as UpdateUserPositionDto

    await this.service.updateUserPosition(client.id, dto);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }

  @SubscribeMessage('toggl-mute-user')
  async handleToglMute (_: Socket, payload: ToglMuteDto){
    const {link} = payload;
    
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }

  @SubscribeMessage('call-user')
  async callUser (client: Socket, data: any){
    this.logger.debug(`callUser: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id
    });
  }
  
  @SubscribeMessage('make-answer')
  async makeAnswer (client: Socket, data: any){
    this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('answer-made', {
      answer: data.answer,
      socket: client.id
    });
  }
 
}