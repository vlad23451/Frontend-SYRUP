import AuthStore from './AuthStore'
import MyHistoriesStore from './MyHistoriesStore'
import HistoriesViewStore from './HistoriesViewStore'
import ChatStore from './ChatStore'
import MessagesStore from './MessagesStore'
import ProfileStore from './ProfileStore'
import UserProfileStore from './UserProfileStore'
import WebSocketStore from './WebSocketStore'

class RootStore {
  constructor() {
    this.auth = AuthStore
    this.myHistories = MyHistoriesStore
    this.historiesView = HistoriesViewStore
    this.chat = ChatStore
    this.messages = MessagesStore
    this.profile = ProfileStore
    this.userProfile = UserProfileStore
    this.websocket = WebSocketStore
  }
}

const rootStore = new RootStore()
export default rootStore
