import { PrismaClient, Account } from "@prisma/client"
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../routes/configs';


const prisma = new PrismaClient()
const jwtToken = String(config.jwtToken);
// import { createReturnObject } from '../utils/returnObjectUtil';
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
                res.status(400).send('Authorization header is required').json({
                    error: 'Authorize Error',
                    message: 'Authorization header is required',
                });
                return
            }
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, jwtToken) as JwtPayload
            const account: AccountType | null = await prisma.account.findUnique({
                where: {
                    id: decoded.id
                },
                select: {
                    id: true,
                    // username: true,
                    // password: true,
                    // email: true,
                    // personnelID: true,
                    Personnel: {
                        select: {
                            type: true
                        }
                    }
                }
            })
            if (!account) {
                res.status(401).send('Account not found').json({
                    error: 'Authorize Error',
                    message: 'Account not found',
                });
                return
            }
            if (!types.includes(account.Personnel?.type)) {
                res.status(401).send('Permission denied').json({
                    error: 'Authorize Error',
                    message: 'Permission denied',
                });
                return
            }
            req.account = account;
            next()
        }
        catch (error) {
            console.log(error)
            res.status(401).send('Account not found').json({
                error: 'Authorize Error',
                message: 'Something went wrong',
            });
        }
    }
}
export default authorizeUser
