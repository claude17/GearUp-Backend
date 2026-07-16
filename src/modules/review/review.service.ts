import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (customerId: string, payload: ICreateReviewPayload) => {

    const rental = await prisma.rentalOrder.findUniqueOrThrow({
        where: {
            id: payload.rentalOrderId
        }
    });


    if (rental.customerId !== customerId) {
        throw new Error("You are not authorized to review this rental.");
    }

    if (rental.status !== RentalStatus.RETURNED) {
        throw new Error(
            "You can review a gear only after the rental has been returned."
        );
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            rentalOrderId: payload.rentalOrderId
        }
    });

    if (existingReview) {
        throw new Error("You have already reviewed this rental.");
    }

    const result = await prisma.review.create({
        data: {
            customerId,
            gearItemId: rental.gearItemId,
            rentalOrderId: rental.id,
            rating: payload.rating,
            comment: payload.comment
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true
                }
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return result;
};

const getAllReviewsFromDB = async () => {

    const result = await prisma.review.findMany({
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true
                }
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            rentalOrder: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;

};

const getReviewsByGearFromDB = async (gearItemId: string) => {

    const result = await prisma.review.findMany({
        where: {
            gearItemId
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;

};

const getSingleReviewFromDB = async (reviewId: string) => {

    const result = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true
                }
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            rentalOrder: true
        }
    });

    return result;

};

const updateReviewIntoDB = async (reviewId: string, customerId: string, payload: IUpdateReviewPayload) => {

    const review = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        }
    });

    if (review.customerId !== customerId) {
        throw new Error(
            "You are not authorized to update this review."
        );
    }

    if (payload.rating !== undefined && (payload.rating < 1 || payload.rating > 5)) {
        throw new Error("Rating must be between 1 and 5.");
    }

    const result = await prisma.review.update({
        where: {
            id: reviewId
        },
        data: payload,
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true
                }
            },
            gearItem: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return result;

};

const deleteReviewFromDB = async (
    reviewId: string,
    customerId: string
) => {

    const review = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        }
    });

    if (review.customerId !== customerId) {
        throw new Error(
            "You are not authorized to delete this review."
        );
    }

    await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

};

export const reviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getReviewsByGearFromDB,
    getSingleReviewFromDB,
    updateReviewIntoDB,
    deleteReviewFromDB
};