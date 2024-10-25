import { forwardRef, Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { qrCode, qrCodeSchema } from './schemas/qrCode.schemas';
import { AuthService } from '@/auth/auth.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';

@Module({
  imports: [
    UserModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: qrCode.name, schema: qrCodeSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService,LocalStrategy, JwtStrategy],
  exports: [QrCodeService]
})
export class QrCodeModule {}
