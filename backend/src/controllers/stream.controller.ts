import { Request, Response } from 'express'
import { StreamedService } from '../services/streamed.service'

const streamed = new StreamedService()

export async function getStreams(req: Request, res: Response) {
  const { source, id } = req.query as Record<string, string>
  if (!id) {
    res.status(400).json({ error: 'Missing ?id= or ?source=&id= parameter' })
    return
  }
  const src = source || 'football'
  const data = await streamed.getStreams(src, id)
  res.json(data)
}

export async function getStreamMatches(_req: Request, res: Response) {
  const data = await streamed.getLivePopular()
  res.json(data)
}
