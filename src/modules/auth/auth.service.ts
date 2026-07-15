import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, phone, address, profileImage, role } = payload;

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
            profileImage,
            role
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


    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("The email is incorrect or not found");
    }



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



export const authService = {
    registerUserIntoDB,
    loginUser

};