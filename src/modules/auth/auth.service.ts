import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, phone, address, profileImage } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    });

    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createduser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            phone,
            address,
            profileImage
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createduser.id,
            email: createduser.email
        },
        omit: {
            password: true
        }
    });

    return user;
};

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;


    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    });

    if (user.status === "SUSPENDED") {
        throw new Error("Your account has been suspended. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return {
        accessToken
    };
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

export const authService = {
    registerUserIntoDB,
    loginUser,
    getMyProfileFromDB

};