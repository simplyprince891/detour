import { Request, Response } from 'express'
import { TeamService } from '../services/team.service'

const teamService = new TeamService()

export async function getTeams(_req: Request, res: Response) {
  const teams = await teamService.getAllTeams()
  res.json({ teams })
}

export async function getTeamById(req: Request, res: Response) {
  const team = await teamService.getTeamById(req.params.id)
  if (!team) {
    res.status(404).json({ error: 'Team not found' })
    return
  }
  res.json({ team })
}

export async function getTeamPlayers(req: Request, res: Response) {
  const players = await teamService.getTeamPlayers(req.params.id)
  res.json({ players })
}
