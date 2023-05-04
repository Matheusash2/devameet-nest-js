import { Module } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetController } from './meet.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Meet, MeetSchema } from './schemas/meet.schema';
import { MeetObject, MeetObjectSchema } from './schemas/meetobject.schema';

@Module({
  imports: [UserModule, MongooseModule.forFeature([
    {name: Meet.name, schema: MeetSchema}, 
    {name: MeetObject.name, schema: MeetObjectSchema}
  ])],
  providers: [MeetService],
  controllers: [MeetController],
  exports: [MongooseModule, MeetService]
})
export class MeetModule {}
