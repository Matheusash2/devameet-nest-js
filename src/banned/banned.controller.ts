import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedUserDto } from './dtos/banned.dto';
import { GetBannedDto } from './dtos/getbanned.dto';

@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @Post()
  async createBanByUser(@Request() req, @Body() dto: BannedUserDto) {
    const { userId } = req?.user;
    const meetId = dto.meet;
    const userBannedId = dto.userBannedId;
    return await this.bannedService.createBanByUser(userId, dto);
  }

  @Delete(':id')
  async deleteBanByUser(@Request() req, @Param() params) {
    const { userId } = req?.user;
    const { id } = params;
    return await this.bannedService.deleteBanByUser(id, userId);
  }

  @Get(':meet')
  async getBansMeet(@Param() params) {
    const { meet } = params;
    const bans = await this.bannedService.getBansMeet(meet);
    return bans.map(
      (b) =>
        ({
          _id: b._id.toString(),
          meet: b.meet.toString(),
          user: b.user.toString(),
          userBanned: b.userBanned.toString(),
          userBannedId: b.userBannedId.toString(),
          userBannedName: b.userBannedName.toString(),
          userBannedAvatar: b.userBannedAvatar.toString(),
        }) as GetBannedDto);
  }

  @Get(':id')
  async getBanByUser(@Request() req, @Param() params) {
    const { userId } = req?.user;
    const { id } = params;
    return await this.bannedService.getBanByUser(id, userId);
  }

  @Get()
  async getBansByUser(@Request() req) {
    const { userId } = req?.user;
    const bans = await this.bannedService.getBansByUser(userId);
    return bans.map(
      (b) =>
        ({
          _id: b._id.toString(),
          meet: b.meet.toString(),
          user: b.user.toString(),
          userBanned: b.userBanned.toString(),
          userBannedId: b.userBannedId.toString(),
          userBannedName: b.userBannedName.toString(),
          userBannedAvatar: b.userBannedAvatar.toString(),
        }) as GetBannedDto);
  }
}
