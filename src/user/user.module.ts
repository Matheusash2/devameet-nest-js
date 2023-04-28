import { Module } from "@nestjs/common";
import { User, UserSchema } from "./schemas/user.schema";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose"

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers:[],
    providers:[UserService],
    exports:[UserService, MongooseModule]
})

export class UserModule{}