import { Module } from "@nestjs/common";
import { User, UserSchema } from "./schemas/user.schema";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose"
import { UserController } from "./user.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService, MongooseModule]
})

export class UserModule{}