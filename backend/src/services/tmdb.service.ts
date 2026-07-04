import axios from 'axios'
import { config } from '../config'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export class TmdbService {
  async discover(filter: string, genreId: number | null = null) {
    const { data } = await axios.get(`${TMDB_BASE}/discover/${filter}`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      params: { ...(genreId ? { with_genres: genreId } : {}), sort_by: 'popularity.desc' },
      timeout: 5000,
    })
    return data
  }

  async search(query: string) {
    const { data } = await axios.get(`${TMDB_BASE}/search/multi`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      params: { query },
      timeout: 5000,
    })
    return data
  }

  async getDetails(type: string, id: string) {
    const { data } = await axios.get(`${TMDB_BASE}/${type}/${id}`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      timeout: 5000,
    })
    return data
  }

  async getCredits(type: string, id: string) {
    const { data } = await axios.get(`${TMDB_BASE}/${type}/${id}/credits`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      timeout: 5000,
    })
    return data
  }

  async getSimilar(type: string, id: string) {
    const { data } = await axios.get(`${TMDB_BASE}/${type}/${id}/similar`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      timeout: 5000,
    })
    return data
  }

  async getSeason(type: string, id: string, season: number) {
    const { data } = await axios.get(`${TMDB_BASE}/${type}/${id}/season/${season}`, {
      headers: { Authorization: `Bearer ${config.tmdb.accessToken}` },
      timeout: 5000,
    })
    return data
  }
}
