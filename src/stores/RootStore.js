import AuthStore from './AuthStore'
import MyHistoriesStore from './MyHistoriesStore'
import ChatStore from './ChatStore'
import MessagesStore from './MessagesStore'
import ProfileStore from './ProfileStore'
import UserProfileStore from './UserProfileStore'

class RootStore {
  constructor() {
    this.auth = AuthStore
    this.myHistories = MyHistoriesStore
    this.chat = ChatStore
    this.messages = MessagesStore
    this.profile = ProfileStore
    this.userProfile = UserProfileStore
  }
}

const rootStore = new RootStore()
export default rootStore
