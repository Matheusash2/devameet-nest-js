import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "src/user/dtos/register.dto";
import { IsPublic } from "./decorators/ispublic.decorator";


@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @IsPublic()
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }
    
    @Post('register')
    @HttpCode(HttpStatus.OK)
    @IsPublic()
    register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }
}