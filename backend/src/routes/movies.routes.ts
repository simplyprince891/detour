import { Router } from 'express'
import { discoverMovies, searchMovies, getMovieDetails, getMovieSeason, getEmbedUrl } from '../controllers/movies.controller'

const router = Router()

router.get('/discover', discoverMovies)
router.get('/search', searchMovies)
router.get('/embed-url', getEmbedUrl)
router.get('/:type/:id/season/:season', getMovieSeason)
router.get('/:type/:id', getMovieDetails)

export default router
