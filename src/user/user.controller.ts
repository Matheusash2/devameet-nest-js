import { BadRequestException, Controller, Get, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMessagesHelper } from "./helpers/messages.helper";


@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Get()
    async getUser(@Request() req){
        const {userId} = req?.user;
        const user = await this.userService.getUserById(userId);

        if(!user){
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user._id
        }
    }
}
