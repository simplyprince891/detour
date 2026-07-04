import { Request, Response } from 'express'
import { TmdbService } from '../services/tmdb.service'

const tmdb = new TmdbService()

export async function discoverMovies(req: Request, res: Response) {
  const { filter = 'movie', genreId } = req.query as Record<string, string | undefined>
  const data = await tmdb.discover(filter, genreId ? parseInt(genreId) : null)
  res.json(data)
}

export async function searchMovies(req: Request, res: Response) {
  const { query } = req.query as Record<string, string>
  if (!query) {
    res.status(400).json({ error: 'Missing ?query= parameter' })
    return
  }
  const data = await tmdb.search(query)
  res.json(data)
}

export async function getMovieDetails(req: Request, res: Response) {
  const { type, id } = req.params
  const details = await tmdb.getDetails(type, id)
  const credits = await tmdb.getCredits(type, id)
  const similar = await tmdb.getSimilar(type, id)
  res.json({ details, credits: credits.cast?.slice(0, 8) || [], similar: similar.results?.slice(0, 10) || [] })
}

export async function getMovieSeason(req: Request, res: Response) {
  const { type, id, season } = req.params
  const data = await tmdb.getSeason(type, id, parseInt(season))
  res.json(data)
}

export async function getEmbedUrl(req: Request, res: Response) {
  const { type, id, season, episode } = req.query as Record<string, string>
  let url: string
  if (type === 'movie') {
    url = `https://www.vidking.net/embed/movie/${id}?color=10b981&autoPlay=true`
  } else {
    url = `https://www.vidking.net/embed/tv/${id}/${season || '1'}/${episode || '1'}?color=10b981&autoPlay=true`
  }
  res.json({ embedUrl: url })
}
