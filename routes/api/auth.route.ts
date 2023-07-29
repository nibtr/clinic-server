import express from 'express';
const router = express.Router();
import {controller} from '../controllers/auth.controller'

router.post('/login', controller.login)
router.get('/confirmation/:confirmCode', controller.validate)

export default router
