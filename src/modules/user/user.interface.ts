import { UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateProfilePayload {
    name?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
}

export interface IUpdateUserStatusPayload {
    status: UserStatus;
}