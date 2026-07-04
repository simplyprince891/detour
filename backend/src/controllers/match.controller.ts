import { Request, Response } from 'express'
import { MatchService } from '../services/match.service'

const matchService = new MatchService()

export async function getTodayMatches(_req: Request, res: Response) {
  const matches = await matchService.getTodayMatches()
  res.json({ date: new Date().toISOString().slice(0, 10), matches })
}

export async function getMatches(req: Request, res: Response) {
  const { stage, dateFrom, dateTo, teamId } = req.query as Record<string, string | undefined>
  const matches = await matchService.getMatches({ stage, dateFrom, dateTo, teamId })
  res.json({ matches })
}

export async function getMatchById(req: Request, res: Response) {
  const match = await matchService.getMatchDetail(req.params.id)
  if (!match) {
    res.status(404).json({ error: 'Match not found' })
    return
  }
  res.json({ match })
}
