import { Router } from "express";
import { aggregateNotes, createNote, deleteNote, deleteNotes, getNote, getNoteByContent, getNoteWithUser, paginateSort, replaceNote, updateAllTitle, updateNote } from "./note.service.js";
import { authenticateToken } from "../../common/token/jwt.token.js";

const noteRouter = Router()

noteRouter.post('/', authenticateToken, createNote)
noteRouter.patch('/all', authenticateToken, updateAllTitle)
noteRouter.patch('/replace/:noteId', authenticateToken, replaceNote)
noteRouter.get('/paginate-sort', authenticateToken, paginateSort)
noteRouter.get('/note-by-content', authenticateToken, getNoteByContent)
noteRouter.get('/note-with-user', authenticateToken, getNoteWithUser)
noteRouter.get('/aggregate', authenticateToken, aggregateNotes)
noteRouter.get('/:noteId', authenticateToken, getNote)
noteRouter.patch('/:noteId', authenticateToken, updateNote)
noteRouter.delete('/', authenticateToken, deleteNotes)
noteRouter.delete('/:noteId', authenticateToken, deleteNote)

export default noteRouter