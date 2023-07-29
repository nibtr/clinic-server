import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import { comparePassword } from '../utils/passwordUtil'

export const login = async (req: Request, res: Response) => {
    try{
        if (!req.body || !req.body.username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        await prisma.$transaction(async (tx)=>{
            const account = await tx.account.findUnique({
                where:{
                    username: req.body.username
                }
            })
        })
    }
}