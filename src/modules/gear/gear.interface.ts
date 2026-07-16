import { GearItemWhereInput } from "../../../generated/prisma/models";

export interface ICreateGearPayload {
    name: string;
    brand: string;
    description: string;
    specifications?: string;
    dailyRentalPrice: number;
    stock: number;
    availableStock: number;
    image?: string;
    isAvailable: boolean;
    categoryId: string;
}

export interface IUpdateGearPayload extends Partial<ICreateGearPayload> { }

export interface IGearQuery {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
}