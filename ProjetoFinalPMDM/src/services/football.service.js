const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

const BASE_URL = '/api/football/v4'

import { MOCK_MATCHES } from './mockData.js'

function authHeaders() {
    return {
        'X-Auth-Token': API_KEY
    }
}

async function handleResponse(response) {
    if (!response.ok) {
        const text = await response.text()
        console.error(`API Error ${response.status}:`, text)

        if (response.status === 429) {
            throw new Error('Limite de pedidos à API atingido. Tenta novamente daqui a pouco.')
        }
        if (response.status === 400 || response.status === 403) {
            // Token inválido - usar dados mock
            console.warn('API token inválido. Utilizando dados de demonstração.')
            throw { isMockFallback: true, message: 'token_invalid' }
        }
        throw new Error(`Erro ${response.status} ao comunicar com a API de futebol`)
    }
    return response.json()
}

export class FootballService {
    getMatchesByCompetition(competitionCode, params = {}) {
        const query = new URLSearchParams(params).toString()
        const url = `${BASE_URL}/competitions/${competitionCode}/matches${query ? `?${query}` : ''}`

        return fetch(url, { headers: authHeaders() })
            .then(handleResponse)
            .catch((error) => {

                if (error.isMockFallback) {
                    const dateFrom = params.dateFrom ? new Date(params.dateFrom) : null
                    const dateTo = params.dateTo ? new Date(params.dateTo) : null

                    const filtered = MOCK_MATCHES.filter((match) => {

                        if (match.competition.code !== competitionCode) return false


                        if (dateFrom && dateTo) {
                            const matchDate = new Date(match.utcDate)
                            if (matchDate < dateFrom || matchDate > dateTo) return false
                        }

                        return true
                    })

                    return {
                        matches: filtered,
                        competition: filtered[0]?.competition || {
                            id: 0,
                            name: competitionCode,
                            code: competitionCode
                        }
                    }
                }
                throw error
            })
    }

    getMatchDetails(matchId) {
        const url = `${BASE_URL}/matches/${matchId}`

        return fetch(url, { headers: authHeaders() })
            .then(handleResponse)
            .catch((error) => {

                if (error.isMockFallback) {
                    const match = MOCK_MATCHES.find((m) => m.id == matchId)
                    if (match) return match
                    throw new Error('Jogo não encontrado')
                }
                throw error
            })
    }

    getMatches(params = {}) {
        const query = new URLSearchParams(params).toString()
        const url = `${BASE_URL}/matches${query ? `?${query}` : ''}`

        return fetch(url, { headers: authHeaders() })
            .then(handleResponse)
            .catch((error) => {
                // Se for erro de token, retornar dados mock
                if (error.isMockFallback) {
                    return {
                        matches: MOCK_MATCHES
                    }
                }
                throw error
            })
    }
}


