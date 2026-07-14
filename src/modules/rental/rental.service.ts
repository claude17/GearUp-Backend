import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload, IUpdateRentalStatusPayload } from "./rental.interface";

const createRentalIntoDB = async (customerId: string, payload: ICreateRentalPayload) => {

    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: {
            id: payload.gearId
        }
    });

    if (gear.availableStock < payload.quantity) {
        throw new Error("Insufficient stock available.");
    }

    if (!gear.isAvailable) {
        throw new Error("This gear is currently unavailable.");
    }

    const providerId = gear.providerId;

    const totalDays = Math.ceil((new Date(payload.endDate).getTime() - new Date(payload.startDate).getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
        throw new Error("End date must be after start date.");
    }

    const totalAmount = gear.dailyRentalPrice * payload.quantity * totalDays;


    const result = await prisma.$transaction(async (tx) => {
        const rental = await tx.rentalOrder.create({
            data: {
                customerId,
                providerId,
                gearItemId: payload.gearId,
                quantity: payload.quantity,
                startDate: new Date(payload.startDate),
                endDate: new Date(payload.endDate),
                totalAmount
            },
            include: {
                customer: true,
                provider: true,
                gearItem: true
            }
        });

        const updatedAvailableStock =
            gear.availableStock - payload.quantity;

        await tx.gearItem.update({
            where: {
                id: gear.id
            },
            data: {
                availableStock: updatedAvailableStock,
                isAvailable: updatedAvailableStock > 0
            }
        });
        return rental;
    });
    return result;
};

const getMyRentalsFromDB = async (customerId: string) => {

    const result = await prisma.rentalOrder.findMany({
        where: {
            customerId
        },
        include: {
            gearItem: true,
            payment: true,
            review: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

const getSingleRentalFromDB = async (rentalId: string) => {

    const result = await prisma.rentalOrder.findUniqueOrThrow({
        where: {
            id: rentalId
        },
        include: {
            customer: true,
            provider: true,
            gearItem: true,
            payment: true,
            review: true
        }
    });

    return result;
};

const getProviderOrdersFromDB = async (providerId: string) => {

    const result = await prisma.rentalOrder.findMany({
        where: {
            providerId
        },
        include: {
            customer: true,
            gearItem: true,
            payment: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

const updateRentalStatusIntoDB = async (rentalId: string, providerId: string, payload: IUpdateRentalStatusPayload) => {

    const rental = await prisma.rentalOrder.findUniqueOrThrow({
        where: {
            id: rentalId
        }
    });

    if (rental.providerId !== providerId) {
        throw new Error("You are not authorized to update this rental.");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedRental = await tx.rentalOrder.update({
            where: {
                id: rentalId
            },
            data: {
                status: payload.status
            },
            include: {
                customer: true,
                provider: true,
                gearItem: true,
                payment: true
            }
        });

        if (
            payload.status === "RETURNED" &&
            rental.status !== "RETURNED"
        ) {

            const gear = await tx.gearItem.findUniqueOrThrow({
                where: {
                    id: rental.gearItemId
                }
            });

            const updatedAvailableStock = gear.availableStock + rental.quantity;

            await tx.gearItem.update({
                where: {
                    id: gear.id
                },
                data: {
                    availableStock: updatedAvailableStock,
                    isAvailable: updatedAvailableStock > 0
                }
            });
        }

        return updatedRental;
    });
    return result;
};

const getAllRentalsFromDB = async () => {

    const result = await prisma.rentalOrder.findMany({
        include: {
            customer: true,
            provider: true,
            gearItem: true,
            payment: true,
            review: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

export const rentalService = {
    createRentalIntoDB,
    getMyRentalsFromDB,
    getSingleRentalFromDB,
    getProviderOrdersFromDB,
    updateRentalStatusIntoDB,
    getAllRentalsFromDB
};