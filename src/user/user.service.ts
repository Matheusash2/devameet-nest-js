import { Model } from 'mongoose'; 
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/user/dtos/register.dto';
import * as CryptoJS from "crypto-js";

@Injectable()
export class UserService {
 constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

 async create(dto: RegisterDto): Promise<User> {
  dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();

  const createdUser = new this.userModel(dto);
  return createdUser.save();
 }

 async existsByEmail(email: String) : Promise<boolean>{
  const result = await this.userModel.findOne({email});
  if(result){
    return true;
  }
  return false;
 }
};