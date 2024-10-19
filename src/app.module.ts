import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { connection } from 'mongoose';
import { CategoryModule } from './modules/category/category.module';
import { ComboModule } from './modules/combo/combo.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';

@Module({
  imports: [
    CategoryModule,
    ComboModule,
    EmployeeModule,
    OrderModule,
    ProductModule ,
    QrCodeModule,
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true,  
    }),
    MongooseModule.forRoot(process.env.DB_URL)
  ],
  controllers: [AppController],
  providers: [AppService],
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
