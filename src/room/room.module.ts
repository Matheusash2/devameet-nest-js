import { Module, forwardRef } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MeetModule } from 'src/meet/meet.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { RoomGateway } from './room.gateway';
import { BannedModule } from 'src/banned/banned.module';

@Module({
  imports: [MeetModule, UserModule, forwardRef(() => BannedModule),
    MongooseModule.forFeature([{name: Position.name, schema: PositionSchema}])],
  providers: [RoomService, RoomGateway],
  controllers: [RoomController],
  exports: [RoomService, MongooseModule]
})
export class RoomModule {}
