import { PartialType } from '@nestjs/mapped-types';
import { CartItemDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CartItemDto) {}
