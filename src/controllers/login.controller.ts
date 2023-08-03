import jwt from 'jsonwebtoken'
import { comparePassword } from '../utils/passwordUtil'
import { Request, Response, NextFunction } from 'express';
import prismaClient from "../utils/prismaClient";
import config from '../configs';
import { messageResponse } from "../utils/messageResponse";



export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        if (!username) {
            return res.status(400).json(messageResponse(400, "Username is required"));
        }
        if (!password) {
            return res.status(400).json(messageResponse(400, "Password is required"));
        }
        await prismaClient.$transaction(async (tx) => {
            const account = await tx.account.findUnique({
                where: {
                    username: String(username)
                },
                select: {
                    id: true,
                    username: true,
                    password: true,
                    Personnel: {
                        select: {
                            type: true
                        }
                    }
                }
            })
            if (!account) {
                return res.status(400).json(messageResponse(400, "Account not found"));
            }
            const storedPassword = account.password
            const isMatch = await comparePassword(password, storedPassword)
            if (!isMatch) {
                return res.status(400).json(messageResponse(400, "Invalid username or password"));
            }
            const token = jwt.sign({ id: account.id, type: account.Personnel.type }, String(config.jwtToken))
            const returnObject = {
                token,
                username: account.username,
                type: account.Personnel.type
            }
            res.status(200).json(messageResponse(200, returnObject))
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json(messageResponse(500, "Something went wrong with username and password"))
    }
}
