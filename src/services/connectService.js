import { apiRequest } from '../utils/apiUtils'

const connectService = async () => {
    // Используем WebSocket URL для LocalTunnel (замените на ваш актуальный URL)
    const wsUrl = 'wss://myprojectfastapi.loca.lt/ws/'
    const connect = new window.WebSocket(wsUrl)

    connect.onopen = async () => {
        console.log('🔌 WebSocket connection opened')
        try {
            // Получаем токен через API эндпоинт
            console.log('🔑 Requesting access token from /auth/token...')
            const tokenResponse = await apiRequest('/auth/token', {
                method: 'GET'
            })
            
            const access_token = tokenResponse.access_token
            
            if (access_token) {
                console.log('✅ Access token received, sending to WebSocket')
                connect.send(JSON.stringify({
                    type: 'access_token',
                    "token": access_token
                }))
                console.log('📤 Token sent to WebSocket successfully')
            } else {
                console.error('❌ No access token received from /auth/token:', tokenResponse)
            }
        } catch (error) {
            console.error('❌ Failed to get access token for WebSocket:', error.message)
        }
    }

    connect.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            console.log('📨 WebSocket message received:', data)
        } catch (error) {
            console.error('❌ Failed to parse WebSocket message:', error)
        }
    }

    connect.onclose = (event) => {
        console.log('🔌 WebSocket connection closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
        })
    }

    connect.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
    }

    return connect
}

export default connectService
