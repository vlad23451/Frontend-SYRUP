/**
 * @fileoverview Страница профиля пользователя
 * 
 * Этот компонент представляет страницу профиля пользователя, которая содержит:
 * - Информацию о пользователе (аватар, имя, email)
 * - Форму для изменения пароля
 * - Список историй пользователя
 * 
 * Структура страницы:
 * - ProfileHeader: отображение основной информации пользователя
 * - ChangePasswordForm: форма для смены пароля
 * - UserHistories: список историй пользователя
 * 
 * Функциональность:
 * - Отображение профиля пользователя
 * - Возможность изменения пароля
 * - Просмотр личных историй
 * - Интеграция с системой аутентификации
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */
import { useNavigate } from "react-router-dom"
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'

import ProfileHeader from "../components/profile/ProfileHeader"
import UserHistories from "../components/profile/UserHistories"

const Profile = observer(() => {
    const { auth } = useStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await auth.logout()
        navigate('/')
    }

    return (
        <div className="page-container">
            <div className="profile-page">
                <div className="profile-container">
                    <ProfileHeader/>
                    <div className="profile-content">
                        <UserHistories />
                        <div className="profile-actions">
                            <button onClick={handleLogout} className="btn btn-danger">
                                Выйти из аккаунта
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Profile
