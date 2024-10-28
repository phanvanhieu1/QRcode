import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helper/util';
import { JwtService } from '@nestjs/jwt';
import { QrCodeService } from '@/modules/qr-code/qr-code.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, 
    private qrCodeService: QrCodeService, 
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string):Promise<any> {
    const user = await this.usersService.findByUsername(username); 
    const isValidPassword = await comparePasswordHelper(pass, user.password)
    if(!user || !isValidPassword) return null
    return user;
  }

  // async validateTable(table: string, pass: string):Promise<any> {
  //   const user = await this.qrCodeService.findByNumberTable(table);  
  //   const isValidPassword = await comparePasswordHelper(pass, user.password)
  //   if(!user || !isValidPassword) return null
  //   return user;
  // }

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

  checkTable = async (username: string) => {
    return await this.usersService.findByUsername(username)
 }

 checkPass = async(pass1: any, pass2: any)=> {
  return comparePasswordHelper(pass1, pass2)
 }

  async loginGUEST(table: any, body: any) {
    const rs = await this.checkTable(table)
    if(body.password !== rs.password) {
      throw new UnauthorizedException("sai tk mk");
    }
    const payload = { 
      username: rs.username, 
      sub: rs._id, 
      role: rs.role 
    };  
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '12h',
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