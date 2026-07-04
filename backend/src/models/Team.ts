import { query, queryOne } from '../config/database'

export const TeamModel = {
  async findAll(): Promise<any[]> {
    return query<any>('SELECT * FROM teams ORDER BY name ASC')
  },

  async findById(id: string): Promise<any | null> {
    return queryOne<any>('SELECT * FROM teams WHERE id = $1', [id])
  },

  async findByCode(code: string): Promise<any | null> {
    return queryOne<any>('SELECT * FROM teams WHERE code = $1', [code])
  },

  async create(name: string, code: string, flagUrl?: string, groupName?: string): Promise<any> {
    const rows = await query<any>(
      `INSERT INTO teams (name, code, flag_url, group_name) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, code, flagUrl ?? null, groupName ?? null]
    )
    return rows[0]
  },
}

export const PlayerModel = {
  async findByTeam(teamId: string): Promise<any[]> {
    return query<any>(
      'SELECT * FROM players WHERE team_id = $1 ORDER BY jersey_number ASC',
      [teamId]
    )
  },

  async create(data: { teamId: string; name: string; position?: string; jerseyNumber?: number; photoUrl?: string }): Promise<any> {
    const rows = await query<any>(
      `INSERT INTO players (team_id, name, position, jersey_number, photo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.teamId, data.name, data.position ?? null, data.jerseyNumber ?? null, data.photoUrl ?? null]
    )
    return rows[0]
  },
}
