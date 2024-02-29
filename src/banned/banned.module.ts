import { Module, forwardRef } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetModule } from 'src/meet/meet.module';
import { Banned, BannedSchema } from './schemas/banned.schema';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [forwardRef(() => RoomModule), UserModule, MeetModule, MongooseModule.forFeature([
    {name: Banned.name, schema: BannedSchema}
  ])],
  providers: [BannedService],
  controllers: [BannedController],
  exports: [BannedService, MongooseModule]
})
export class BannedModule {}
