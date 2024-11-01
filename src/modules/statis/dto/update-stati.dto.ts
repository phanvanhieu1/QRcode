import { PartialType } from '@nestjs/mapped-types';
import { CreateStatiDto } from './create-stati.dto';

export class UpdateStatiDto extends PartialType(CreateStatiDto) {}
