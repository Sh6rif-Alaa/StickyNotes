import noteModel from "../../DB/models/note.model.js"
import userModel from './../../DB/models/user.model.js';
import * as db_service from "../../DB/db.service.js"
import successResponse from './../../common/utils/successResponse.js';
import checkOwner from "../../common/utils/checkOwner.js";
import findUser from "../../common/utils/findUser.js";
import { Types } from "mongoose";

// ----------------------------------- create ------------------------------------------

export const createNote = async (req, res) => {
    const { title, content } = req.body

    if (!title || !content)
        throw new Error('title & content required', { cause: 400 })

    await findUser({ userModel, id: req.decodedToken.data })

    const note = await db_service.create({ model: noteModel, data: { title, content, userId: req.decodedToken.data } })

    successResponse({ res, status: 201, message: "created", data: note })
}

// ----------------------------------- update ------------------------------------------

export const updateNote = async (req, res) => {
    const { title, content } = req.body
    const { noteId } = req.params

    await checkOwner({ noteModel, filter: { _id: noteId }, ownerId: req.decodedToken.data })

    const note = await db_service.findByIdAndUpdate({ model: noteModel, id: noteId, data: { title, content } })

    successResponse({ res, message: "updated", data: note })
}

export const replaceNote = async (req, res) => {
    const { title, content } = req.body
    const { noteId } = req.params

    await checkOwner({ noteModel, filter: { _id: noteId }, ownerId: req.decodedToken.data })

    const note = await db_service.findOneAndReplace({ model: noteModel, filter: { _id: noteId }, data: { title, content, userId: req.decodedToken.data } })

    successResponse({ res, message: "Replaced - updated", data: note })
}

export const updateAllTitle = async (req, res) => {
    const { title } = req.body

    await findUser({ userModel, id: req.decodedToken.data })

    const notes = await db_service.updateMany({ model: noteModel, filter: { userId: req.decodedToken.data }, data: { title } })

    successResponse({ res, message: "All title updated", data: notes })
}

// ----------------------------------- delete ------------------------------------------

export const deleteNote = async (req, res) => {
    const { noteId } = req.params

    await checkOwner({ noteModel, filter: { _id: noteId }, ownerId: req.decodedToken.data })

    const note = await db_service.findByIdAndDelete({ model: noteModel, id: noteId })

    successResponse({ res, message: "deleted", data: note })
}

export const deleteNotes = async (req, res) => {
    const notes = await db_service.deleteMany({ model: noteModel, filter: { userId: req.decodedToken.data } })

    successResponse({ res, message: "deleted", data: notes })
}

// ----------------------------------- get ------------------------------------------

export const getNote = async (req, res) => {
    const { noteId } = req.params

    const note = await checkOwner({ noteModel, filter: { _id: noteId }, ownerId: req.decodedToken.data })

    successResponse({ res, data: note })
}

export const getNoteByContent = async (req, res) => {
    const { content } = req.query

    const note = await checkOwner({ noteModel, filter: { content }, ownerId: req.decodedToken.data })

    successResponse({ res, data: note })
}

export const getNoteWithUser = async (req, res) => {
    await findUser({ userModel, id: req.decodedToken.data })

    const notes = await db_service.find({
        model: noteModel,
        filter: { userId: req.decodedToken.data },
        options: {
            select: 'title userId createdAt',
            populate: {
                path: 'userId',
                select: 'email -_id'
            },
            sort: { createdAt: -1 }
        }
    })

    successResponse({ res, data: notes })
}

export const paginateSort = async (req, res) => {
    // convert page & limit to number & must be positive
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    await findUser({ userModel, id: req.decodedToken.data })

    const notes = await db_service.find({ model: noteModel, filter: { userId: req.decodedToken.data }, options: { limit, skip, sort: { createdAt: -1 } } })

    successResponse({ res, data: notes })
}

export const aggregateNotes = async (req, res, next) => {
    const { title } = req.query

    const pipeline = [
        {
            $match: {
                userId: new Types.ObjectId(req.decodedToken.data),
                ...(title && {
                    title: { $regex: title, $options: "i" }
                })
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                title: 1,
                createdAt: 1,
                "user.name": 1,
                "user.email": 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]

    const notes = await db_service.aggregate({ model: noteModel, pipeline })

    successResponse({ res, data: notes })
}