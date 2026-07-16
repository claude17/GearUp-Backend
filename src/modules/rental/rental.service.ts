import { RentalStatus, Role } from "../../../generated/prisma/enums";
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
                gearItem: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        dailyRentalPrice: true,
                    },
                },
            }
        });

        const updatedAvailableStock = gear.availableStock - payload.quantity;

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
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    image: true,
                    dailyRentalPrice: true,
                },
            },
            payment: {
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    provider: true,
                    paidAt: true,
                },
            },
            review: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                },
            },
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
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    image: true,
                    specifications: true,
                    dailyRentalPrice: true,
                },
            },
            payment: {
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    provider: true,
                    transactionId: true,
                    paidAt: true,
                },
            },
            review: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                },
            },
        },
    });

    return result;
};

const getProviderOrdersFromDB = async (providerId: string) => {

    const result = await prisma.rentalOrder.findMany({
        where: {
            providerId
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    image: true,
                    dailyRentalPrice: true,
                },
            },
            payment: {
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    provider: true,
                    paidAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

const updateRentalStatusIntoDB = async (rentalId: string, userId: string, role: Role, payload: IUpdateRentalStatusPayload) => {

    const rental = await prisma.rentalOrder.findUniqueOrThrow({
        where: {
            id: rentalId
        }
    });

    if (role === Role.CUSTOMER) {

        if (rental.customerId !== userId) {
            throw new Error("You are not authorized to update this rental.");
        }

        if (rental.status !== RentalStatus.PLACED) {
            throw new Error("Only placed rentals can be cancelled.");
        }

        if (payload.status !== RentalStatus.CANCELLED) {
            throw new Error("Customers can only cancel rentals.");
        }
    }

    if (role === Role.PROVIDER) {

        if (rental.providerId !== userId) {
            throw new Error("You are not authorized to update this rental.");
        }

        switch (rental.status) {

            case RentalStatus.PLACED:
                if (payload.status !== RentalStatus.CONFIRMED) {
                    throw new Error("A placed rental can only be confirmed.");
                }
                break;

            case RentalStatus.CONFIRMED:
                throw new Error(
                    "This rental must be paid before it can be picked up."
                );

            case RentalStatus.PAID:
                if (payload.status !== RentalStatus.PICKED_UP) {
                    throw new Error(
                        "A paid rental can only be marked as picked up."
                    );
                }
                break;

            case RentalStatus.PICKED_UP:
                if (payload.status !== RentalStatus.RETURNED) {
                    throw new Error(
                        "A picked up rental can only be marked as returned."
                    );
                }
                break;

            case RentalStatus.RETURNED:
                throw new Error("Rental has already been returned.");

            case RentalStatus.CANCELLED:
                throw new Error("Rental has already been cancelled.");

            default:
                throw new Error("Invalid rental status.");
        }
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
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                gearItem: {
                    select: {
                        id: true,
                        name: true,
                        brand: true,
                        image: true
                    }
                },
                payment: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        provider: true,
                        paidAt: true
                    }
                }
            }
        });

        if (payload.status === RentalStatus.CANCELLED || payload.status === RentalStatus.RETURNED) {

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
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true
                }
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    image: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                }
            },
            payment: {
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    provider: true,
                    transactionId: true,
                    paidAt: true
                }
            },
            review: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true
                }
            }
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