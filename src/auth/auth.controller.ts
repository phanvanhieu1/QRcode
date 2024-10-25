import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { RoleGuard } from './authorization/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.login(req.user)
  }

  // @Get("profile")
  // @UseGuards(JwtAuthGuard)
  // getProfile(@Request() req) {
  //   return req.user
  // }
}
