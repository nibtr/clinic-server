import jwt from 'jsonwebtoken'
import { comparePassword } from '../utils/passwordUtil'
import { Request, Response } from 'express';
import prismaClient from "../utils/prismaClient";
import config from '../routes/configs';


export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!{ username, password }) {
            res.status(400).json({ error: 'Username is required' });
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
                res.status(401).json({
                    error: "Error",
                    message: "Account not found"
                });
                return
            }
            const storedPassword = account.password
            const isMatch = await comparePassword(req.body.password, storedPassword)
            if (!isMatch) {
                res.status(401).json({
                    error: "Error",
                    message: "Invalid username or password"
                });
                return
            }
            const token = jwt.sign({ id: account.id }, String(config.jwtToken))
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

    }
}