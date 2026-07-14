import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "./category.interface";


const createCategoryIntoDB = async (payload: ICreateCategoryPayload) => {
    const result = await prisma.category.create({
        data: { ...payload }
    });

    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

const updateCategoryIntoDB = async (categoryId: string, payload: IUpdateCategoryPayload
) => {
    const category = await prisma.category.findFirstOrThrow({
        where: {
            id: categoryId
        }
    });
    const result = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    });

    return result;
};

const deleteCategoryFromDB = async (categoryId: string) => {
    const result = await prisma.category.delete({
        where: {
            id: categoryId
        }
    });

    return result;
};

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB
};