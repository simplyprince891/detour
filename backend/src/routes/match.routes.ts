import { Router } from 'express'
import { getTodayMatches, getMatches, getMatchById } from '../controllers/match.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/today', getTodayMatches)
router.get('/', getMatches)
router.get('/:id', getMatchById)

export default router
