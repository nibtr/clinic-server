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
            res.status(400).json(messageResponse(400, {
                error: "Error",
                message: "Username is required"
            }));
            return;
        }
        if (!password) {
            res.status(400).json(messageResponse(400, {
                error: "Error",
                message: "Password is required"
            }));
            return;
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
                return res.status(400).json(messageResponse(400, {
                    error: "Error",
                    message: "Account not found"
                })
                );

            }
            const storedPassword = account.password
            const isMatch = await comparePassword(password, storedPassword)
            if (!isMatch) {
                return res.status(400).json(messageResponse(400, {
                    error: "Error",
                    message: "Invalid username or password"
                }));

            }
            const token = jwt.sign({ id: account.id, type: account.Personnel.type }, String(config.jwtToken))
            const returnObject = {
                token,
                username: account.username,
                type: account.Personnel.type
            }
            res.status(200).json({
                returnObject
            })
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Error",
            message: "Something went wrong with username and password"
        })
        next(error)
    }
}