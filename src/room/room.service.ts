import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobject.schema';
import { Position, PositionDocument } from './schemas/position.schema';
import { UserService } from 'src/user/user.service';
import { RoomMessagesHelper } from './helpers/roommessages.helper';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);

    constructor(
        @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetObjectDocument>,
        @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
        private readonly userService : UserService
    ){}

    async getRoom(link: string){
        this.logger.debug(`getRoom - ${link}`);

        const meet = await this._getMeet(link);
        const objects = await this.objectModel.find({meet});

        return{
            link,
            name: meet.name,
            color: meet.color,
            objects
            };
        }

        async listUsersPositionByLink(link: string) {
            this.logger.debug(`listUsersPositionByLink - ${link}`);
          
            const meet = await this._getMeet(link);
          
            // Obtenha apenas as posições associadas a usuários logados (clientId não é null)
            const usersPositions = await this.positionModel.find({
              meet,
              clientId: { $ne: null },
            });
          
            return usersPositions;
          }

        async getUserPosition (userId: string, link: string){
            this.logger.debug(`getUserPosition - ${userId} - ${link}`);

            const meet = await this._getMeet(link);
            // Obtenha a posição do usuário
            const position = await this.positionModel.findOne({user: userId, meet});

            return position;
        }

        async deleteUsersPosition(clientId: string, meet: MeetDocument) {
            this.logger.debug(`deleteUsersPosition - ${clientId}`);
          
            // Verifica se a sala foi excluída
            const deletedMeet = await this.meetModel.findOne({ _id: meet._id });
            if (!deletedMeet) {
              await this.positionModel.deleteMany({ clientId });
            } else {
              await this.positionModel.updateMany({ clientId }, { $set: { clientId: null } });
            }
          }

        async updateUserPosition(clientId: string, dto: UpdateUserPositionDto){
            this.logger.debug(`updateUserPositionByLink - ${dto.link}`);

            const meet = await this._getMeet(dto.link);
            const user = await this.userService.getUserById(dto.userId);

            if(!user){
                throw new BadRequestException(RoomMessagesHelper.JOIN_USER_NOT_VALID);
            }

            const position = {
                ...dto,
                clientId,
                user,
                meet,
                name: user.name,
                avatar: user.avatar
            }

            const usersInRoom = await this.positionModel.find({meet});
            
            const loggedUserInRoom = usersInRoom.find(u =>
                u.user.toString() === user._id.toString() || u.clientId === clientId);

            if(loggedUserInRoom){
                await this.positionModel.findByIdAndUpdate({_id: loggedUserInRoom._id},position);
            }else{
                if(usersInRoom && usersInRoom.length > 10){
                    throw new BadRequestException(RoomMessagesHelper.ROOM_MAX_USERS);
                };
                await this.positionModel.create(position);
            }
        }

        async updateUserMute(dto: ToglMuteDto){
            this.logger.debug(`updateUserMute -${dto.link} - ${dto.userId}`);

            const meet = await this._getMeet(dto.link);
            const user = await this.userService.getUserById(dto.userId);
            await this.positionModel.updateMany({user, meet}, {muted: dto.muted});
        }
        
        async _getMeet(link: string){
            const meet = await this.meetModel.findOne({link});
            if(!meet){
                throw new BadRequestException(RoomMessagesHelper.JOIN_LINK_NOT_VALID);
            }

            return meet;
        }
    }

