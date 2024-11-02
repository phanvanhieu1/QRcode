import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

export class ItemDto {
    @IsNotEmpty()
    itemId: string;  // ID của sản phẩm

    @IsPositive()
    quantity: number;  // Số lượng món cần thêm

    @IsPositive()
    amount: number; // Tổng giá trị của món cần thêm
}

export class AddItemsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items: ItemDto[]; // Mảng các món ăn
}