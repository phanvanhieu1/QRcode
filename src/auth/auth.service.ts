import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helper/util';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!user || !isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  checkTable = async (username: string) => {
    return await this.usersService.findByUsername(username);
  };

  checkPass = async (pass1: any, pass2: any) => {
    return comparePasswordHelper(pass1, pass2);
  };

  async loginGUEST(table: any, body: any) {
    const user = this.validateUser(table, body.password);
    const rs = await this.checkTable(table);
    if (!user) {
      throw new UnauthorizedException('dang nhap loi');
    }
    const sessionId = uuidv4();
    const payload = {
      username: rs.username,
      sub: sessionId,
      role: rs.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '12h',
      }),
    };
  }
}
