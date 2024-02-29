import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banned, BannedDocument } from './schemas/banned.schema';
import { UserService } from 'src/user/user.service';
import { MeetService } from 'src/meet/meet.service';
import { BannedMessagesHelper } from './helpers/bannedmessages.helper';
import { BannedUserDto } from './dtos/banned.dto';
import { Position, PositionDocument } from 'src/room/schemas/position.schema';

@Injectable()
export class BannedService {
  private readonly logger = new Logger(BannedService.name);

  constructor(
    @InjectModel(Banned.name)
    private readonly bannedModel: Model<BannedDocument>,
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    private readonly meetService: MeetService,
    private readonly userService: UserService,
  ) {}

  async createBanByUser(userId: string, dto: BannedUserDto) {
    try {
      this.logger.debug('bannedUser - ' + dto.userBannedId);
      const user = await this.userService.getUserById(userId);
      const meet = await this.meetService.getMeetById(dto.meet, userId);

      if (!meet) {
        throw new BadRequestException(BannedMessagesHelper.MEET_NOT_FOUND);
      }

      if (meet.user.toString() !== userId) {
        throw new BadRequestException(BannedMessagesHelper.USER_CREATOR_ROOM);
      }

      const userBannedInRoom = await this.positionModel.findOne({
        meet,
        user: dto.userBannedId,
      });

      if (!userBannedInRoom) {
        throw new BadRequestException(
          BannedMessagesHelper.BANNED_USER_NOT_FOUND,
        );
      }

      const existingBanned = await this.bannedModel.findOne({
        meet,
        userBanned: userBannedInRoom._id,
        userBannedId: userBannedInRoom.user
      });

      if (existingBanned) {
        throw new BadRequestException(BannedMessagesHelper.BANNED_USER_CONFIRM);
      }

      const banned = {
        meet,
        user,
        userBanned: userBannedInRoom,
        userBannedId: userBannedInRoom.user,
        userBannedName: userBannedInRoom.name,
        userBannedAvatar: userBannedInRoom.avatar
      };

      const createdBanned = new this.bannedModel(banned);
      await createdBanned.save();
      this.logger.log(
        `Usuário ${userBannedInRoom.name} banido com sucesso na sala ${meet.name}.`,
      );
      return { message: BannedMessagesHelper.SUCCESS_BANNED_USER };
    } catch (error) {
      this.logger.error(`Erro durante o banimento: ${error.message}`);
      throw error;
    }
  }

  async deleteBanByUser(bannedId: string, userId: string) {
    try {
      this.logger.debug(`deleteBanUser - ${bannedId} - ${userId}`);

      const existingBanned = await this.bannedModel.findOne({
        _id: bannedId,
        user: userId,
      });

      if (!existingBanned) {
        throw new BadRequestException(
          BannedMessagesHelper.BANNED_USER_NOT_ROOM,
        );
      }

      await existingBanned.deleteOne();
      this.logger.log(
        `Usuário ${existingBanned.userBannedId} desbanido com sucesso na sala ${existingBanned.meet}.`,
      );
      return { message: BannedMessagesHelper.SUCCESS_UNBANNED_USER };
    } catch (error) {
      this.logger.error(`Erro durante o desbanimento: ${error.message}`);
      throw error;
    }
  }

  async getBanByUser(bannedId: string, userId: string) {
    try {
      this.logger.debug(`getBanUser - ${bannedId} - ${userId}`);
      const user = await this.userService.getUserById(userId);
      const ban = await this.bannedModel.findOne({ _id: bannedId, user });
      return ban;
    } catch (error) {
      this.logger.error(`Erro durante a busca do ban: ${error.message}`);
      throw error;
    }
  }

  async getBansByUser(userId: string) {
    try {
      this.logger.debug(`getBansUser - ${userId}`);
      const bans = await this.bannedModel.find({ user: userId });
      return bans;
    } catch (error) {
      this.logger.error(`Erro durante a busca dos bans: ${error.message}`);
      throw error;
    }
  }

  async getBansMeet(meet: string) {
    try {
      this.logger.debug(`getBansMeet - ${meet}`);
      const bans = await this.bannedModel.find({meet});
      return bans;
    } catch (error) {
      this.logger.error(`Erro durante a busca dos bans: ${error.message}`);
      throw error;
    }
  }
}
