import { Router } from 'express'
import { getSports, getLiveMatches, getTodayMatches, getMatchById, getMatchStreams } from '../controllers/streamed.controller'

const router = Router()

router.get('/sports', getSports)
router.get('/matches/live', getLiveMatches)
router.get('/matches/today', getTodayMatches)
router.get('/matches/:id', getMatchById)
router.get('/streams/:source/:id', getMatchStreams)

export default router
