import { Controller, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService){}

    @Get(':link')
    async getRoom(@Param()params){
        const {link} = params;
        return await this.roomService.getRoom(link);
    }
}
