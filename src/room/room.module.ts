import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MeetModule } from 'src/meet/meet.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [MeetModule, UserModule, 
    MongooseModule.forFeature([{name: Position.name, schema: PositionSchema}])],
  providers: [RoomService, RoomGateway],
  controllers: [RoomController]
})
export class RoomModule {}
