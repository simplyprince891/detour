import { query, queryOne } from '../config/database'

export interface MatchRow {
  id: string
  home_team_id: string
  away_team_id: string
  datetime: string
  status: string
  stage: string
  venue: string | null
  home_score: number | null
  away_score: number | null
  group_name: string | null
  created_at: string
  updated_at: string
}

export interface TeamBrief {
  id: string
  name: string
  code: string
  flag_url: string | null
}

const MATCH_SELECT = `
  SELECT
    m.*,
    ht.name AS home_name, ht.code AS home_code, ht.flag_url AS home_flag,
    at.name AS away_name, at.code AS away_code, at.flag_url AS away_flag
  FROM matches m
  JOIN teams ht ON ht.id = m.home_team_id
  JOIN teams at ON at.id = m.away_team_id
`

function rowToMatch(row: any) {
  return {
    id: row.id,
    homeTeam: { id: row.home_team_id, name: row.home_name, code: row.home_code, flagUrl: row.home_flag },
    awayTeam: { id: row.away_team_id, name: row.away_name, code: row.away_code, flagUrl: row.away_flag },
    datetime: row.datetime,
    status: row.status,
    stage: row.stage,
    venue: row.venue,
    homeScore: row.home_score,
    awayScore: row.away_score,
    groupName: row.group_name,
  }
}

export const MatchModel = {
  async findToday(): Promise<any[]> {
    const rows = await query<any>(
      `${MATCH_SELECT} WHERE m.datetime::date = CURRENT_DATE ORDER BY m.datetime ASC`
    )
    return rows.map(rowToMatch)
  },

  async findAll(filters?: { stage?: string; dateFrom?: string; dateTo?: string; teamId?: string }): Promise<any[]> {
    const conditions: string[] = []
    const params: any[] = []
    let idx = 1

    if (filters?.stage) {
      conditions.push(`m.stage = $${idx++}`)
      params.push(filters.stage)
    }
    if (filters?.dateFrom) {
      conditions.push(`m.datetime >= $${idx++}`)
      params.push(filters.dateFrom)
    }
    if (filters?.dateTo) {
      conditions.push(`m.datetime <= $${idx++}`)
      params.push(filters.dateTo)
    }
    if (filters?.teamId) {
      conditions.push(`(m.home_team_id = $${idx++} OR m.away_team_id = $${idx++})`)
      params.push(filters.teamId, filters.teamId)
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''
    const sql = `${MATCH_SELECT} ${where} ORDER BY m.datetime ASC`
    const rows = await query<any>(sql, params)
    return rows.map(rowToMatch)
  },

  async findById(id: string): Promise<any | null> {
    const row = await queryOne<any>(`${MATCH_SELECT} WHERE m.id = $1`, [id])
    if (!row) return null
    return rowToMatch(row)
  },

  async insert(data: {
    homeTeamId: string; awayTeamId: string; datetime: string; stage: string
    venue?: string; groupName?: string
  }): Promise<MatchRow> {
    const rows = await query<MatchRow>(
      `INSERT INTO matches (home_team_id, away_team_id, datetime, stage, venue, group_name)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.homeTeamId, data.awayTeamId, data.datetime, data.stage, data.venue ?? null, data.groupName ?? null]
    )
    return rows[0]
  },

  async updateScore(id: string, homeScore: number, awayScore: number): Promise<void> {
    await query(
      `UPDATE matches SET home_score = $1, away_score = $2, updated_at = NOW() WHERE id = $3`,
      [homeScore, awayScore, id]
    )
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await query(
      `UPDATE matches SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    )
  },
}
