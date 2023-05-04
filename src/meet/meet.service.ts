import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { UserService } from 'src/user/user.service';
import { generateLink } from './helpers/linkgenerator.helper';
import { CreateMeetDto } from './dtos/createmeet.dto';

@Injectable()
export class MeetService {
    private readonly logger = new Logger(MeetService.name);

    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        private readonly userService: UserService
    ){}

    async getMeetsByUser(userId: string){
        this.logger.debug('getMeetsByUser - ' + userId);
        return await this.model.find({user: userId});
    }

    async createMeet(userId: string, dto: CreateMeetDto){
        this.logger.debug('createMeet - ' + userId);

        const user = await this.userService.getUserById(userId);

        const meet = {
            ...dto,
            user,
            link: generateLink()
        }

        const createdMeet = new this.model(meet);
        return await createdMeet.save();
    }

    async deleteMeetByUser(userId: string, meetId: string){
        this.logger.debug(`deleteMeetByUser - ${userId} - ${meetId}`);
        return await this.model.deleteOne({user: userId, _id: meetId});
    }
}
