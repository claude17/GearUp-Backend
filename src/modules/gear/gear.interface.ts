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