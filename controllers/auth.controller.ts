import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import { comparePassword } from '../utils/passwordUtil'
import { Request, Response } from 'express';
import prismaClient from "../utils/prismaClient";


export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try{
        if (!{username, password}) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        await prismaClient.$transaction(async (tx)=>{
            const account = await tx.account.findUnique({
                where:{
                    username: String(username)
                }
            })
            if(!account){
                res.status(200).json({
                    username, password
                })
            }
        })

        
        res.status(200).json({
            username, password
        })
    }
    catch(error){

    }


    
}