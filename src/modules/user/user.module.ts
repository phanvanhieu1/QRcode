import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user, userSchema } from './schemas/user.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: user.name, schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
