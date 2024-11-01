import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { connection } from 'mongoose';
import { CategoryModule } from './modules/category/category.module';
import { ComboModule } from './modules/combo/combo.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

@Module({
  imports: [
    CategoryModule,
    ComboModule,
    OrderModule,
    ProductModule ,
    QrCodeModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true,  
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})


export class AppModule implements OnModuleInit {
  onModuleInit() {
    mongoose.connect(process.env.DB_URL).then(() => {
      console.log("connect ok");
    })
    .catch(()=>{
      console.log("error")
    })
  }
}
