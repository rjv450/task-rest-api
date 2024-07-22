import { Controller, Request, Post, UseGuards, Body, Res, Get, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';

import { LoginDto } from './dtos/login-user.dto';
import { ValidationPipe } from 'src/util/validationPipe';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginUserDto: LoginDto, @Res() res) {
        console.log("sdfghjk");
        
        const token = await this.authService.login(loginUserDto);
        res.cookie('jwt', token.access_token, { httpOnly: true });
        return res.send({ message: 'Logged in successfully' });
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto:CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Request() req, @Res() res) {
        await this.authService.logout(req.user.userId);
        res.clearCookie('jwt');
        return res.send({ message: 'Logged out successfully' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
