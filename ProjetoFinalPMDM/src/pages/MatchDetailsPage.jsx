import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonLoading, IonBackButton, IonButtons, IonBadge,
    IonList, IonItem, IonLabel
} from '@ionic/react'
import { FootballService } from '../services/football.service'
import { statusLabel, formatMatchDate } from '../utils/matchUtils'

const service = new FootballService()

function MatchDetailsPage() {
    const { id } = useParams()
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        service.getMatchDetails(id)
            .then((data) => setMatch(data.match ?? data))
            .finally(() => setLoading(false))
    }, [id])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/jogos" />
                    </IonButtons>
                    <IonTitle>Detalhes do Jogo</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonLoading isOpen={loading} message="A carregar..." />

                {match && (
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>
                                {match.homeTeam?.name} vs {match.awayTeam?.name}
                            </IonCardTitle>
                            <IonCardSubtitle>
                                {match.competition?.name} · {formatMatchDate(match.utcDate)}
                            </IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <IonBadge color="primary">{statusLabel(match.status)}</IonBadge>

                            <h2 style={{ textAlign: 'center', margin: '16px 0' }}>
                                {match.score?.fullTime?.home ?? '-'} : {match.score?.fullTime?.away ?? '-'}
                            </h2>

                            <IonList>
                                <IonItem>
                                    <IonLabel>Época</IonLabel>
                                    <IonLabel slot="end">
                                        {match.season?.startDate?.split('-')[0]} / {match.season?.endDate?.split('-')[0]}
                                    </IonLabel>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Jornada</IonLabel>
                                    <IonLabel slot="end">{match.matchday ?? '-'}</IonLabel>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Estádio</IonLabel>
                                    <IonLabel slot="end">{match.venue ?? 'Não disponível'}</IonLabel>
                                </IonItem>

                                {match.referees?.length > 0 && (
                                    <IonItem>
                                        <IonLabel>Árbitro</IonLabel>
                                        <IonLabel slot="end">{match.referees[0]?.name}</IonLabel>
                                    </IonItem>
                                )}
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonPage>
    )
}

export default MatchDetailsPage
