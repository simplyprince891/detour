import { MatchModel } from '../models/Match'
import { query } from '../config/database'

export class MatchService {
  async getTodayMatches() {
    return MatchModel.findToday()
  }

  async getMatches(filters?: { stage?: string; dateFrom?: string; dateTo?: string; teamId?: string }) {
    return MatchModel.findAll(filters)
  }

  async getMatchDetail(id: string) {
    const match = await MatchModel.findById(id)
    if (!match) return null

    const [goals, homeLineup, awayLineup, commentaries] = await Promise.all([
      query<any>(
        `SELECT g.*, p.name AS scorer_name FROM goals g
         LEFT JOIN players p ON p.id = g.player_id
         WHERE g.match_id = $1 ORDER BY g.minute ASC`,
        [id]
      ),
      query<any>(
        `SELECT p.id AS player_id, p.name, p.position, p.jersey_number, l.is_starting
         FROM lineups l JOIN players p ON p.id = l.player_id
         WHERE l.match_id = $1 AND l.team_id = $2 ORDER BY l.is_starting DESC, p.jersey_number ASC`,
        [id, match.homeTeam.id]
      ),
      query<any>(
        `SELECT p.id AS player_id, p.name, p.position, p.jersey_number, l.is_starting
         FROM lineups l JOIN players p ON p.id = l.player_id
         WHERE l.match_id = $1 AND l.team_id = $2 ORDER BY l.is_starting DESC, p.jersey_number ASC`,
        [id, match.awayTeam.id]
      ),
      query<any>(
        'SELECT * FROM commentaries WHERE match_id = $1 ORDER BY minute ASC',
        [id]
      ),
    ])

    return {
      ...match,
      goals: goals.map((g: any) => ({
        id: g.id, matchId: g.match_id, playerId: g.player_id, teamId: g.team_id,
        minute: g.minute, type: g.type, scorerName: g.scorer_name,
      })),
      homeLineup: homeLineup.map((p: any) => ({
        playerId: p.player_id, name: p.name, position: p.position,
        jerseyNumber: p.jersey_number, isStarting: p.is_starting,
      })),
      awayLineup: awayLineup.map((p: any) => ({
        playerId: p.player_id, name: p.name, position: p.position,
        jerseyNumber: p.jersey_number, isStarting: p.is_starting,
      })),
      commentaries: commentaries.map((c: any) => ({
        id: c.id, matchId: c.match_id, minute: c.minute,
        text: c.text, type: c.type,
      })),
    }
  }
}
