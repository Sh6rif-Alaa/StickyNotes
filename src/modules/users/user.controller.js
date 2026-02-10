import { Router } from "express";
import { deleteUser, getUser, login, signUp, updateUser } from "./user.service.js";
import { authenticateToken } from "../../common/token/jwt.token.js";

const userRouter = Router()

userRouter.post('/signup', signUp)
userRouter.post('/login', login)
userRouter.patch('/', authenticateToken, updateUser)
userRouter.delete('/', authenticateToken, deleteUser)
userRouter.get('/', authenticateToken, getUser)

export default userRouter