import axios from 'axios'

const SPORTSRC_BASE = 'https://api.sportsrc.org'

export class SportSrcService {
  async getMatches(category = 'football') {
    const { data } = await axios.get(`${SPORTSRC_BASE}/`, {
      params: { data: 'matches', category },
    })
    return data
  }

  async getMatchDetail(category: string, id: string) {
    const { data } = await axios.get(`${SPORTSRC_BASE}/`, {
      params: { data: 'detail', category, id },
    })
    return data
  }
}
