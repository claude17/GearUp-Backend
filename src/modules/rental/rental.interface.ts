import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalPayload {
    gearId: string;
    quantity: number;
    startDate: Date | string;
    endDate: Date | string;
}

export interface IUpdateRentalStatusPayload {
    status: RentalStatus;
}