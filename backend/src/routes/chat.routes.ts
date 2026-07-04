import { Router } from 'express'
import { getMessages, sendMessage } from '../controllers/chat.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/:matchId/chat', getMessages)
router.post('/:matchId/chat', sendMessage)

export default router
