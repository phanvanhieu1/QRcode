import { Injectable } from '@nestjs/common';
import { CreateStatiDto } from './dto/create-stati.dto';
import { UpdateStatiDto } from './dto/update-stati.dto';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StatisService {

  private sheets;

  constructor(private configService: ConfigService) {
    // Khởi tạo Google Sheets API client
    this.sheets = google.sheets({
      version: 'v4',
      auth: new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      }),
    });
  }

  create(createStatiDto: CreateStatiDto) {
    return 'This action adds a new stati';
  }

  findAll() {
    return `This action returns all statis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stati`;
  }

  update(id: number, updateStatiDto: UpdateStatiDto) {
    return `This action updates a #${id} stati`;
  }

  remove(id: number) {
    return `This action removes a #${id} stati`;
  }
}
