import { apiRequest } from '../utils/apiUtils'
import WebSocketStore from '../stores/WebSocketStore'

const connectService = async () => {
    //const wsUrl = 'wss://myprojectfastapi.loca.lt/ws/'
    const wsUrl = 'ws://localhost:8000/ws/'
    const connect = new window.WebSocket(wsUrl)

    connect.onopen = async () => {
        WebSocketStore.setConnection(connect)
        WebSocketStore.setConnected(true)
        
        try {
            const tokenResponse = await apiRequest('/auth/token', {
                method: 'GET'
            })
            
            if (tokenResponse.access_token) {
                const tokenMessage = {
                    type: 'access_token',
                    "token": tokenResponse.access_token
                }
                connect.send(JSON.stringify(tokenMessage))
            } else {
                console.warn('Нет access_token в ответе')
            }
        } catch (error) {
            console.error('Ошибка получения токена:', error)
            WebSocketStore.setError('Ошибка аутентификации')
        }
    }

    connect.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            
            WebSocketStore.handleIncomingMessage(data)
        } catch (error) {
            console.error('❌ Ошибка парсинга WebSocket сообщения:', error)
        }
    }

    connect.onclose = (event) => {
        WebSocketStore.setConnected(false)
        WebSocketStore.setConnection(null)
    }

    connect.onerror = (error) => {
        console.error('❌ WebSocket ошибка:', error)
        WebSocketStore.setError('Ошибка WebSocket соединения')
        WebSocketStore.setConnected(false)
    }

    return connect
}

export default connectService
