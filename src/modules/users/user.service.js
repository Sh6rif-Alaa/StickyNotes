import userModel from "../../DB/models/user.model.js"
import successResponse from "../../common/utils/successResponse.js"
import * as db_services from "../../DB/db.service.js"
import { decrypt, encrypt } from "../../common/security/encrypt.security.js"
import { Compare, Hash } from './../../common/security/hash.security.js'
import { jwtToken } from './../../common/token/jwt.token.js'
import findUser from "../../common/utils/findUser.js"


export const signUp = async (req, res) => {
    const { name, email, password, phone, age } = req.body

    if (!name || !password || !email || !phone)
        throw new Error("(name & password & email & phone) are required", { cause: 400 })

    if (await db_services.findOne({ model: userModel, filter: { email } }))
        throw new Error("email already exist", { cause: 409 })

    const user = await db_services.create({
        model: userModel, data: {
            name,
            email,
            password: Hash({ plainText: password }),
            phone: encrypt({ text: phone }),
            age
        }
    })

    successResponse({ res, status: 201, data: user, message: "created" })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await db_services.findOne({ model: userModel, filter: { email } })

    if (!user)
        throw new Error("user not exist", { cause: 404 })

    if (!Compare({ plainText: password, hash: user.password }))
        throw new Error("invalid password", { cause: 400 })

    successResponse({ res, token: jwtToken({ data: user._id }), message: "login successful" })
}

export const updateUser = async (req, res) => {
    const { name, email, phone, age } = req.body

    if (email && await db_services.findOne({ model: userModel, filter: { email } }))
        throw new Error("email already exist", { cause: 409 })

    const updateData = { name, email, age };

    if (phone) updateData.phone = encrypt({ text: phone });

    const user = await db_services.findByIdAndUpdate({ model: userModel, id: req.decodedToken.data, data: updateData, options: { select: '-password' } })

    if (!user) throw new Error("user not exist", { cause: 404 })

    successResponse({ res, data: { ...user._doc, phone: decrypt({ cipherText: user.phone }) }, message: "updated" })
}

export const deleteUser = async (req, res) => {
    const user = await db_services.findByIdAndDelete({ model: userModel, id: req.decodedToken.data, options: { select: '-password' } })

    if (!user) throw new Error("user not exist", { cause: 404 })

    successResponse({ res, data: user, message: "deleted" })
}

export const getUser = async (req, res) => {
    const user = await findUser({ userModel, id: req.decodedToken.data })

    successResponse({ res, data: user })
}