import express from 'express';
const router = express.Router();
import * as controller from '../../controllers/login.controller'

router.post('/login', controller.login)

export default router
