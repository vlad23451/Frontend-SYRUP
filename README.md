Слои:
- Pages — агрегируют данные и состояние загрузки, передают в компоненты.
- Components — отображение и минимальная логика UI.
- Hooks — инкапсуляция сценариев/процессов (контроллеры UI, бизнес‑правила).
- Stores — глобальное состояние (MobX), разделяемое между страницами.
- Services — HTTP‑эндпойнты (без UI логики).
- Utils — технические помощники (HTTP, форматирование, пр.).

---

## Роутинг и навигация (Dock)
Определён в `src/App.jsx`:
- `/` — главная лента историй (бесконечный скролл)
- `/following` — лента подписок; доп. кнопка «Друзья» в доке фильтрует на `/following?tab=friends`
- `/login` и `/register` — авторизация/регистрация
- `/profile` — мой профиль
- `/profile/:id` — профиль пользователя
- `/people` — список людей
- `/messenger` — мессенджер

Dock:
- Конфигурация — `hooks/dock/useDockItems.js` (учёт аутентификации и активной страницы)
- Управление и состояние — `hooks/useDockController.js`
- Отрисовка — `components/ui/Dock.jsx`

---

## Сетевой слой и аутентификация
`src/utils/apiUtils.js`:
- `apiRequest(endpoint, options)` — единая точка HTTP:
  - GET без `Content-Type`, остальные — с `application/json`
  - `credentials: include`
  - при `response.status === 400` → `AuthStore.tryRefreshToken()` и повтор запроса
  - ошибки парсятся из JSON и генерируют `Error(message)`

`src/stores/AuthStore.js`:
- Персистит пользователя в `localStorage`
- `tryRefreshToken()` — обновляет токен через `/auth/refresh/` и подтягивает `/user/me`
- `logout()` — `POST /auth/logout/` + очистка локального состояния
- Вычисляемое `isAuthenticated`

---

## Бизнес‑домены
### Истории (Histories)
Сервисы: `src/services/historyService.js`
- Списки:
  - `getHistories(skip, limit)` — все истории
  - `getMyHistories()` — мои истории
  - `getUserHistories(userId)` — истории пользователя
  - `getFollowingHistories(skip, limit)` — лента подписок (`/history/following`)
  - `getFriendsHistories(skip, limit)` — лента друзей (`/history/friends`)
- CRUD:
  - `createHistory(data)` → POST `/history`
  - `updateHistory(id, data)` → PUT `/history/:id`
  - `deleteHistory(id)` → DELETE `/history/:id`
  - `getHistoryById(id)` → GET `/history/:id`
- Реакции:
  - `createHistoryLike(id)` / `deleteHistoryLike(id)` → `/likes`
  - `createHistoryDislike(id)` / `deleteHistoryDislike(id)` → `/dislikes`

UX‑решения:
- Главная лента `/`:
  - бесконечная подгрузка по скроллу
  - после создания истории — мягкий `reloadHistories()` первой страницы без «пустого» состояния
- Профиль:
  - `MyHistoriesStore` поддерживает мгновенное удаление (`removeById`) и обновление (`updateItem`) без перезагрузки
- Редактирование:
  - `EditHistoryModal` возвращает обновлённый объект через `onSuccess(updated)`; родитель синхронно обновляет список

Компоненты:
- `components/histories/HistoryCard.jsx` — композиция карточки (header, content, actions, модалки)
- `components/histories/HistoryList.jsx` — список, пустые состояния
- `components/histories/EditHistoryModal.jsx` + `EditHistoryForm.jsx` — редактирование
- `components/histories/CreateHistoryModal.jsx` + `CreateHistoryForm.jsx` — создание

### Комментарии
Сервис: `src/services/commentService.js`
- CRUD комментариев + лайки/дизлайки
- Получение списка: `GET /history/id/{history_id}/comments`

Хук: `src/hooks/useCommentsController.js`
- Загрузка, создание, редактирование, удаление
- Optimistic UI для добавления
- Лайки/дизлайки с взаимной корректировкой счётчиков
- Автоскролл к последнему комментарию
- Колбэк `onCommentCountUpdate`

### Мессенджер
Сервисы: `src/services/chatService.js`
- `getChats()`, `getChatMessages(companionLogin)`

Сторы:
- `ChatStore` — список чатов, выбранный чат
- `MessagesStore` — список сообщений, закрепления, CRUD для списка

---

## Модалки и UX‑паттерны
- Общий стиль: `styles/modals.css` (`custom-modal*`)
- Перетаскивание: `hooks/useDraggableModal` (ограничение вьюпортом, pointer events)
- Закрытие по ESC и клику на фон
- Граббер строго по центру (CSS гарантирует центрирование)

Кнопки в модалках:
- Нейтральные стили (`custom-modal-btn`) для консистентности с темой
- Группы действий через `custom-modal-actions` (поддержка `space-between` / `center`)

---

## Стейт‑менеджмент
MobX используется для шаринга состояния между экранами:
- `AuthStore` — авторизация, refresh, текущий пользователь
- `MyHistoriesStore` — мои истории; методы `removeById`, `updateItem`
- `ProfileStore` — профиль текущего пользователя
- `UserProfileStore` — профиль пользователя по id + его истории
- `ChatStore`, `MessagesStore` — мессенджер

Страницы используют локальный `useState` и сервисы для загрузки/ошибок/пагинации.

---

## Стили и тема
- `styles/theme.css` — палитра, тема (light/dark), тени, радиусы, типографика
- `styles/modals.css`, `styles/forms.css`, `styles/main.css`, `styles/messenger.css` и др.

---

## API (сводка)
Истории:
- `GET /history?skip&limit` — общая лента
- `GET /history/{id}` — история по id
- `POST /history` — создать историю
- `PUT /history/{id}` — обновить историю
- `DELETE /history/{id}` — удалить историю
- `GET /user/me/histories` — мои истории
- `GET /user/profile/{userId}/histories` — истории пользователя
- `GET /history/following?skip&limit` — лента подписок
- `GET /history/friends?skip&limit` — лента друзей
- `POST /likes` / `DELETE /likes/{history_id}` — лайк истории
- `POST /dislikes` / `DELETE /dislikes/{history_id}` — дизлайк истории

Комментарии:
- `POST /comments`
- `GET /history/id/{history_id}/comments`
- `PUT /comments/{id}` / `DELETE /comments/{id}`
- `POST /comment-likes/` / `DELETE /comment-likes/{id}`
- `POST /comment-dislikes/` / `DELETE /comment-dislikes/{id}`

Пользователи и отношения:
- `GET /user/me`, `GET /user/profile/{id}`
- `POST /followers/`, `DELETE /followers/` — подписка/отписка
- `GET /followers/following/{id}` — список подписок
- `GET /friends/{id}` — список друзей
- `GET /user/search?q=` — поиск

Аутентификация:
- `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`

Чаты:
- `GET /messages/chats` — список чатов
- `GET /messages/chats/{companionLogin}/messages` — сообщения чата

---

## Стандарты кодирования
- Осмысленные имена функций/переменных
- Предпочтение ранним возвратам и плоской вложенности
- Обработка ошибок с понятными сообщениями
- Комментарии отвечают на «почему», а не «что»
- Компоненты максимально «чистые»; бизнес‑логика — в хуках/сторах/сервисах

---

## Работа с формами и модалками
- Контролируемые инпуты, `loading`‑флаги, сообщения об ошибках
- `onSubmit` предотвращает двойные отправки
- Модалки: закрытие по ESC/бекдропу, перетаскивание за граббер, единые классы стилей

---

## Известные ограничения / План развития
- Тесты (юнит/интеграционные) отсутствуют — добавить Jest + React Testing Library
- ErrorBoundary на уровне приложения — внедрить для перехвата падений UI
- i18n отсутствует — локализация зашита (русский)
- `/following` сейчас грузит фиксированный лимит — можно внедрить бесконечный скролл

---

## Вклад и разработка
- Соблюдайте границы слоёв (pages/components/hooks/stores/services)
- Новые фичи:
  - Описывайте эндпоинты в `services/*`
  - Храните разделяемое состояние в `stores/*`, локальное — в страницах
  - Инкапсулируйте процессы в `hooks/*`
- Модалки — используйте `useDraggableModal` и классы `custom-modal*`

---
