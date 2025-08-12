import Cookies from 'js-cookie'

const connectService = async () => {
    const connect = new window.WebSocket('ws://localhost:8000/ws/')

    connect.onopen = () => {
        const access_token = Cookies.get('access_token')
        connect.send(JSON.stringify({
            type: 'access_token',
            "token": access_token
        }))
    }

    connect.onmessage = (event) => {
        const data = JSON.parse(event.data)
    }

    connect.onclose = () => {
    }

    connect.onerror = (error) => {
    }
}

export default connectService
