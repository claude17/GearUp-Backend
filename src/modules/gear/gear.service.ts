import { prisma } from "../../lib/prisma";
import { ICreateGearPayload, IUpdateGearPayload } from "./gear.interface";

const createGearIntoDB = async (providerId: string,
    payload: ICreateGearPayload
) => {

    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId
        }
    });

    const result = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    return result;
};

const getAllGearFromDB = async () => {
    const result = await prisma.gearItem.findMany({
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            reviews: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

const getSingleGearFromDB = async (gearId: string) => {
    const result = await prisma.gearItem.findUnique({
        where: {
            id: gearId
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            reviews: true
        }
    });

    return result;
};

const updateGearIntoDB = async (gearId: string,
    providerId: string, payload: IUpdateGearPayload) => {

    const gear = await prisma.gearItem.findFirstOrThrow({
        where: {
            id: gearId
        }
    });

    if (gear.providerId !== providerId) {
        throw new Error("You are not owner of this gear");
    }

    const result = await prisma.gearItem.update({
        where: {
            id: gearId,
            providerId
        },
        data: payload,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            },
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    return result;
};

const deleteGearFromDB = async (gearId: string, providerId: string) => {

    const gear = await prisma.gearItem.findFirstOrThrow({
        where: {
            id: gearId
        }
    });

    if (gear.providerId !== providerId) {
        throw new Error("You are not owner of this gear");
    }

    await prisma.gearItem.delete({
        where: {
            id: gearId,
        }
    });
};

// const getAdminGearFromDB = async () => {
//     const result = await prisma.gearItem.findMany({
//         include: {
//             category: true,
//             provider: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     status: true
//                 }
//             }
//         },
//         orderBy: {
//             createdAt: "desc"
//         }
//     });

//     return result;
// };

export const gearService = {
    createGearIntoDB,
    getAllGearFromDB,
    getSingleGearFromDB,
    updateGearIntoDB,
    deleteGearFromDB,
    // getAdminGearFromDB
};