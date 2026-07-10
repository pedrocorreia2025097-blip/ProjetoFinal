const STATUS_LABELS = {
    SCHEDULED: 'Agendado',
    TIMED: 'Agendado',
    LIVE: 'Ao vivo',
    IN_PLAY: 'A decorrer',
    PAUSED: 'Intervalo',
    FINISHED: 'Terminado',
    POSTPONED: 'Adiado',
    SUSPENDED: 'Suspenso',
    CANCELLED: 'Cancelado'
}

export function statusLabel(status) {
    return STATUS_LABELS[status] ?? status
}

export function formatMatchDate(utcDate) {
    if (!utcDate) return ''
    return new Date(utcDate).toLocaleString('pt-PT', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}


export function compareMatches(a, b, sortBy) {
    switch (sortBy) {
        case 'competition':
            return (a.competition?.name ?? '').localeCompare(b.competition?.name ?? '')
        case 'homeTeam':
            return (a.homeTeam?.name ?? '').localeCompare(b.homeTeam?.name ?? '')
        case 'status':
            return (a.status ?? '').localeCompare(b.status ?? '')
        case 'date':
        default:
            return new Date(a.utcDate) - new Date(b.utcDate)
    }
}


export function groupMatchesByCompetition(matches) {
    const grouped = {}

    matches.forEach((match) => {
        const competitionId = match.competition?.id
        if (!grouped[competitionId]) {
            grouped[competitionId] = {
                competition: match.competition,
                matches: []
            }
        }
        grouped[competitionId].matches.push(match)
    })

    return Object.values(grouped)
}


export function groupMatchesByDate(matches) {
    const grouped = {}

    matches.forEach((match) => {
        const date = new Date(match.utcDate).toISOString().split('T')[0]
        if (!grouped[date]) {
            grouped[date] = []
        }
        grouped[date].push(match)
    })

    return Object.entries(grouped).map(([date, matches]) => ({
        date,
        matches
    }))
}
