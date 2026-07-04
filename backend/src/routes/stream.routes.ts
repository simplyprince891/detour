import { Router } from 'express'
import { getStreamMatches, getStreams } from '../controllers/stream.controller'

const router = Router()

router.get('/', getStreamMatches)
router.get('/detail', getStreams)

export default router
