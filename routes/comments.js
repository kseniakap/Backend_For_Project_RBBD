import { Router } from 'express'
const router = new Router()
import { checkAuth } from '../utils/checkAuth.js'
import { createComment } from '../controllers/comments.js'

// создание комментария
// http://localhost:3006/comments/:id
router.post('/:id', checkAuth, createComment)

export default router
