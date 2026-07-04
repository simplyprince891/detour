import { Router } from 'express'
import { getTeams, getTeamById, getTeamPlayers } from '../controllers/team.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getTeams)
router.get('/:id', getTeamById)
router.get('/:id/players', getTeamPlayers)

export default router
