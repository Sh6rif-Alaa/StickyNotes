import { findById } from "../../DB/db.service.js"

const findUser = async ({ userModel, id }) => {
    const user = await findById({ model: userModel, id, options: { select: '-password' } })
    if (!user)
        throw new Error('user not exist', { cause: 404 })

    // for get
    return user
}

export default findUser