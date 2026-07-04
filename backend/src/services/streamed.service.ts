import axios from 'axios'

const STREAMFREE_BASE = 'https://streamfree.top'
const TIMEOUT = 20000

const api = axios.create({
  timeout: TIMEOUT,
})

interface Team {
  name?: string
  badge?: string
}

interface Match {
  id: string
  title: string
  category: string
  date: number
  poster?: string
  popular: boolean
  teams?: { home?: Team; away?: Team }
  sources: { source: string; id: string }[]
}

interface Stream {
  id: string
  streamNo: number
  language: string
  hd: boolean
  embedUrl: string
  source: string
}

export class StreamedService {
  private async fetchAllStreams(): Promise<any> {
    try {
      const { data } = await api.get(`${STREAMFREE_BASE}/streams`, {
        headers: { Referer: STREAMFREE_BASE }
      })
      return data?.streams || {}
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  private mapStreamToMatch(s: any, category: string): Match {
    const id = s.stream_key || s.id
    return {
      id: id,
      title: s.name,
      category: category,
      date: (s.match_timestamp || 0) * 1000,
      poster: s.thumbnail_url ? (s.thumbnail_url.startsWith('http') ? s.thumbnail_url : `${STREAMFREE_BASE}${s.thumbnail_url}`) : undefined,
      popular: (s.viewers || 0) >= 100,
      teams: {
        home: {
          name: s.team1?.name,
          badge: s.team1?.logo
        },
        away: {
          name: s.team2?.name,
          badge: s.team2?.logo
        }
      },
      sources: [{ source: category, id: id }]
    }
  }

  async getSports(): Promise<any> {
    const streams = await this.fetchAllStreams()
    return Object.keys(streams).map(k => ({
      id: k,
      name: k.charAt(0).toUpperCase() + k.slice(1)
    }))
  }

  async getLivePopular(): Promise<Match[]> {
    const streams = await this.fetchAllStreams()
    const matches: Match[] = []
    Object.entries(streams).forEach(([cat, list]: [string, any]) => {
      if (Array.isArray(list)) {
        list.forEach(s => {
          matches.push(this.mapStreamToMatch(s, cat))
        })
      }
    })
    return matches.filter(m => m.popular)
  }

  async getTodayPopular(): Promise<Match[]> {
    const streams = await this.fetchAllStreams()
    const matches: Match[] = []
    Object.entries(streams).forEach(([cat, list]: [string, any]) => {
      if (Array.isArray(list)) {
        list.forEach(s => {
          matches.push(this.mapStreamToMatch(s, cat))
        })
      }
    })
    return matches.sort((a, b) => b.date - a.date)
  }

  async getMatchById(id: string): Promise<Match | null> {
    const streams = await this.fetchAllStreams()
    for (const [cat, list] of Object.entries(streams)) {
      if (Array.isArray(list)) {
        const found = list.find(s => (s.stream_key || s.id) === id)
        if (found) {
          return this.mapStreamToMatch(found, cat)
        }
      }
    }
    return null
  }

  async getStreams(source: string, id: string): Promise<Stream[]> {
    const match = await this.getMatchById(id)
    if (!match) return []
    return [{
      id: id,
      streamNo: 1,
      language: 'Main',
      hd: true,
      embedUrl: `${STREAMFREE_BASE}/embed/${source}/${id}`,
      source: source
    }]
  }
}
