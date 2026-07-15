import { prisma } from "../../lib/prisma";
import { IUpdateProfilePayload, IUpdateUserStatusPayload } from "./user.interface";

const getAllUserFromDB = async () => {

    const result = await prisma.user.findMany({
        omit: {
            password: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;

};

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });

    return user;
};

const updateUserStatusIntoDB = async (userId: string, payload: IUpdateUserStatusPayload) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status: payload.status
        },
        omit: {
            password: true
        }
    });

    return result;

};

const updateMyProfileIntoDB = async (userId: string, payload: IUpdateProfilePayload) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: payload,
        omit: {
            password: true
        }
    });

    return result;

};

const deleteUserFromDB = async (userId: string) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    await prisma.user.delete({
        where: {
            id: userId
        }
    });

};

export const userService = {
    getAllUserFromDB,
    getMyProfileFromDB,
    updateUserStatusIntoDB,
    updateMyProfileIntoDB,
    deleteUserFromDB
};