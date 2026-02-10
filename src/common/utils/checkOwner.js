import { findOne } from "../../DB/db.service.js"

const checkOwner = async ({ noteModel, filter, ownerId }) => {
    const note = await findOne({ model: noteModel, filter })

    if (!note)
        throw new Error('note not exist', { cause: 404 })

    if (note.userId.toString() !== ownerId)
        throw new Error('Only the owner of the note can make this operation', { cause: 400 })

    // for get
    return note
}

export default checkOwner