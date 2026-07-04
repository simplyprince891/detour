import { TeamModel, PlayerModel } from '../models/Team'

export class TeamService {
  async getAllTeams() {
    const teams = await TeamModel.findAll()
    return teams.map((t: any) => ({
      id: t.id, name: t.name, code: t.code,
      flagUrl: t.flag_url, groupName: t.group_name,
    }))
  }

  async getTeamById(id: string) {
    const team = await TeamModel.findById(id)
    if (!team) return null

    const players = await PlayerModel.findByTeam(id)
    return {
      id: team.id, name: team.name, code: team.code,
      flagUrl: team.flag_url, groupName: team.group_name,
      players: players.map((p: any) => ({
        id: p.id, teamId: p.team_id, name: p.name, position: p.position,
        jerseyNumber: p.jersey_number, photoUrl: p.photo_url,
      })),
    }
  }

  async getTeamPlayers(teamId: string) {
    const players = await PlayerModel.findByTeam(teamId)
    return players.map((p: any) => ({
      id: p.id, teamId: p.team_id, name: p.name, position: p.position,
      jerseyNumber: p.jersey_number, photoUrl: p.photo_url,
    }))
  }
}
