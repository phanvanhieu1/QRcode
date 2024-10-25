import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helper/util';
import { JwtService } from '@nestjs/jwt';
import { QrCodeService } from '@/modules/qr-code/qr-code.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, 
    private qrCodeService: QrCodeService, 
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string):Promise<any> {
    const user = await this.usersService.findByUsername(username); 
    // if(user.role == 'GUESS') {
    //   user.password = '123'
    // }
    const isValidPassword = await comparePasswordHelper(pass, user.password)
    if(!user || !isValidPassword) return null
    return user;
  }

  async validateTable(table: string, pass: string):Promise<any> {
    const user = await this.qrCodeService.findByNumberTable(table);  
    const isValidPassword = await comparePasswordHelper(pass, user.password)
    if(!user || !isValidPassword) return null
    return user;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user._id,  
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginGuess(user: any) {
    const payload = { 
      table: user.username, 
      sub: user._id, 
      role: user.role 
    };  
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
    };
  }
  

  // async signIn(username: string, pass: string):Promise<any> {
  //   const user = await this.usersService.findByUsername(username);  
  //   const isValidPassword = await comparePasswordHelper(pass, user.password)
  //   if (!isValidPassword) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user._id, username: user.username };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
}