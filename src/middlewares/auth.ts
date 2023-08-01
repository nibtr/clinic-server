import PrismaClient from "../utils/prismaClient"
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../configs';
import { messageResponse } from "../utils/messageResponse";

const jwtToken = String(config.jwtToken);

type AccountType = {
    id: number,
    Personnel?: {
        type: string;
    };
};
interface CustomRequest extends Request {
    account?: AccountType | null;
}
const authorizeUser = function (...types: any[]) {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.headers.authorization) {
                return res.status(400).json(messageResponse(400, 'Authorization header is required'));
            }
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, jwtToken) as JwtPayload
            await PrismaClient.$transaction(async (tx) => {
                const account = await tx.account.findUnique({
                    where: {
                        id: decoded.id
                    }
                })
                if (!account) {
                    return res.status(404).json(messageResponse(404, 'Account not found'));
                }
                if (!types.includes(decoded.type)) {
                    return res.status(401).json(messageResponse(401, 'Permission denied'));
                }
                req.account = account;
                next()
            })
        }
        catch (error) {
            console.log(error)
            res.status(401).json(messageResponse(401, 'Something went wrong'));
            next(error)
        }
    }
}
export default authorizeUser
