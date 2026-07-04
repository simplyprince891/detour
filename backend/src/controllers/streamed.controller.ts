import { Request, Response } from 'express'
import { StreamedService } from '../services/streamed.service'

const streamed = new StreamedService()

export async function getSports(_req: Request, res: Response) {
  const data = await streamed.getSports()
  res.json(data)
}

export async function getLiveMatches(_req: Request, res: Response) {
  const data = await streamed.getLivePopular()
  res.json(data)
}

export async function getTodayMatches(_req: Request, res: Response) {
  const data = await streamed.getTodayPopular()
  res.json(data)
}

export async function getMatchById(req: Request, res: Response) {
  const match = await streamed.getMatchById(req.params.id)
  if (!match) {
    res.status(404).json({ error: 'Match not found' })
    return
  }
  res.json(match)
}

export async function getMatchStreams(req: Request, res: Response) {
  const { source, id } = req.params
  if (!source || !id) {
    res.status(400).json({ error: 'Missing source or id parameter' })
    return
  }
  const data = await streamed.getStreams(source, id)
  res.json(data)
}
