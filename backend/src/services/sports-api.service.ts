import axios from 'axios'
import { config } from '../config'

export class SportsApiService {
  // ---- Sportradar ----
  async fetchSportradarSchedule(date: string) {
    const { data } = await axios.get(
      `${config.sportsApi.sportradar.baseUrl}/en/schedules/${date}/schedule.json`,
      { params: { api_key: config.sportsApi.sportradar.apiKey } }
    )
    return data
  }

  async fetchSportradarLive(matchId: string) {
    const { data } = await axios.get(
      `${config.sportsApi.sportradar.baseUrl}/en/sport_events/${matchId}/timeline.json`,
      { params: { api_key: config.sportsApi.sportradar.apiKey } }
    )
    return data
  }

  // ---- Football-data.org ----
  async fetchFootballDataMatches(competitionCode = 'WC', dateFrom?: string, dateTo?: string) {
    const { data } = await axios.get(
      `${config.sportsApi.footballData.baseUrl}/competitions/${competitionCode}/matches`,
      {
        headers: { 'X-Auth-Token': config.sportsApi.footballData.apiKey },
        params: { dateFrom, dateTo },
      }
    )
    return data
  }

  async fetchFootballDataMatch(matchId: number) {
    const { data } = await axios.get(
      `${config.sportsApi.footballData.baseUrl}/matches/${matchId}`,
      { headers: { 'X-Auth-Token': config.sportsApi.footballData.apiKey } }
    )
    return data
  }
}
