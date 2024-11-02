import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveItemsDto {
    @IsArray()
    @IsNotEmpty()
    items: string[];
}
