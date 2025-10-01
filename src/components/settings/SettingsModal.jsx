import React from 'react'
import ModalHeader from '../ui/ModalHeader'
import { AppearanceSection, ChatSection, NotificationsSection, DockSection, SearchSection, MediaSection, SecuritySection, AccountSection } from './sections'
import { useSettingsController } from '../../hooks/settings/useSettingsController'

const SettingsModal = ({ open, onClose, initialTab = 'appearance', singleMode = false }) => {
  const ctrl = useSettingsController({ open, onClose, initialTab, singleMode })

  if (!open) return null

  return (
    <div className="custom-modal-backdrop" onClick={ctrl.handleBackdrop}>
      <div className="custom-modal-wrapper" ref={ctrl.containerRef}>
        <div className="custom-modal settings-modal" style={{ maxWidth: ctrl.singleMode ? 460 : 720, width: ctrl.singleMode ? '92vw' : '95vw' }}>
          <ModalHeader title="Настройки" onClose={onClose} hideClose />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: ctrl.singleMode ? 12 : 16, paddingBottom: ctrl.singleMode ? 10 : 12 }}>
            <button type="button" className="custom-modal-btn cancel" onClick={ctrl.resetToDefaults}>Сбросить по умолчанию</button>
          </div>
          <div className="custom-modal-content" style={{ display: 'grid', gridTemplateColumns: ctrl.singleMode ? '1fr' : '220px 1fr', gap: ctrl.singleMode ? 12 : 14, minHeight: ctrl.singleMode ? 240 : 300 }}>
            {!ctrl.singleMode && (
              <aside style={{ borderRight: '1px solid var(--color-border)', paddingRight: 10, display: 'flex', flexDirection: 'column', gap: 6, alignSelf: 'stretch' }}>
                {[
                  { key: 'appearance', label: 'Внешний вид' },
                  { key: 'dock', label: 'Док' },
                  { key: 'chat', label: 'Чаты' },
                  { key: 'notifications', label: 'Уведомления' },
                  { key: 'search', label: 'Поиск' },
                  { key: 'media', label: 'Медиа' },
                  { key: 'security', label: 'Безопасность' },
                  { key: 'account', label: 'Аккаунт' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => ctrl.setActiveTab(key)}
                    className="settings-tab-btn"
                    aria-pressed={ctrl.activeTab === key}
                    style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--color-border)', background: ctrl.activeTab === key ? 'var(--color-bg)' : 'transparent', color: 'var(--color-text)', cursor: 'pointer', transition: 'all var(--transition)', fontSize: 14, ...ctrl.getPressedStyle(ctrl.activeTab === key) }}
                  >
                    {label}
                  </button>
                ))}
              </aside>
            )}

            <section style={{ paddingLeft: ctrl.singleMode ? 0 : 2 }}>
              {ctrl.activeTab === 'appearance' && (
                <AppearanceSection
                  theme={ctrl.theme}
                  setTheme={ctrl.setTheme}
                  colorScheme={ctrl.colorScheme}
                  setColorScheme={ctrl.setColorScheme}
                  colorSaturation={ctrl.colorSaturation}
                  setColorSaturation={ctrl.setColorSaturation}
                  fontSize={ctrl.fontSize}
                  setFontSize={ctrl.setFontSize}
                  uiScale={ctrl.uiScale}
                  setUiScale={ctrl.setUiScale}
                  transparency={ctrl.transparency}
                  setTransparency={ctrl.setTransparency}
                  getPressedStyle={ctrl.getPressedStyle}
                />
              )}

              {ctrl.activeTab === 'dock' && (
                <DockSection
                  snapEnabled={ctrl.snapEnabled}
                  handleToggleSnap={ctrl.handleToggleSnap}
                  dockPosition={ctrl.dockPosition}
                  handleSetDockPosition={ctrl.handleSetDockPosition}
                  handleResetDock={ctrl.handleResetDock}
                  getPressedStyle={ctrl.getPressedStyle}
                />
              )}

              {ctrl.activeTab === 'chat' && (
                <ChatSection
                  chatSort={ctrl.chatSort}
                  setChatSort={ctrl.setChatSort}
                  confirmDelete={ctrl.confirmDelete}
                  setConfirmDelete={ctrl.setConfirmDelete}
                  autoDeleteTimer={ctrl.autoDeleteTimer}
                  setAutoDeleteTimer={ctrl.setAutoDeleteTimer}
                  chatAutoPlayMedia={ctrl.chatAutoPlayMedia}
                  setChatAutoPlayMedia={ctrl.setChatAutoPlayMedia}
                  showSendTime={ctrl.showSendTime}
                  setShowSendTime={ctrl.setShowSendTime}
                  showTypingIndicator={ctrl.showTypingIndicator}
                  setShowTypingIndicator={ctrl.setShowTypingIndicator}
                  showDeliveryStatus={ctrl.showDeliveryStatus}
                  setShowDeliveryStatus={ctrl.setShowDeliveryStatus}
                  getPressedStyle={ctrl.getPressedStyle}
                />
              )}

              {ctrl.activeTab === 'notifications' && (
                <NotificationsSection
                  notifEnabled={ctrl.notifEnabled}
                  setNotifEnabled={ctrl.setNotifEnabled}
                  notifSoundEnabled={ctrl.notifSoundEnabled}
                  setNotifSoundEnabled={ctrl.setNotifSoundEnabled}
                  notifOnlyFavorites={ctrl.notifOnlyFavorites}
                  setNotifOnlyFavorites={ctrl.setNotifOnlyFavorites}
                  notifBanners={ctrl.notifBanners}
                  setNotifBanners={ctrl.setNotifBanners}
                  notifToasts={ctrl.notifToasts}
                  setNotifToasts={ctrl.setNotifToasts}
                  notifPreview={ctrl.notifPreview}
                  setNotifPreview={ctrl.setNotifPreview}
                  showUnreadBadge={ctrl.showUnreadBadge}
                  setShowUnreadBadge={ctrl.setShowUnreadBadge}
                />
              )}

              {ctrl.activeTab === 'security' && (
                <SecuritySection
                  loginAlerts={ctrl.loginAlerts}
                  setLoginAlerts={ctrl.setLoginAlerts}
                  manageSessions={ctrl.manageSessions}
                  setManageSessions={ctrl.setManageSessions}
                  trustedDevices={ctrl.trustedDevices}
                  setTrustedDevices={ctrl.setTrustedDevices}
                  activityLog={ctrl.activityLog}
                  setActivityLog={ctrl.setActivityLog}
                  getPressedStyle={ctrl.getPressedStyle}
                />
              )}

              {ctrl.activeTab === 'account' && (
                <AccountSection
                  privacyMsg={ctrl.privacyMsg}
                  setPrivacyMsg={ctrl.setPrivacyMsg}
                  privacyProfile={ctrl.privacyProfile}
                  setPrivacyProfile={ctrl.setPrivacyProfile}
                  privacyOnline={ctrl.privacyOnline}
                  setPrivacyOnline={ctrl.setPrivacyOnline}
                  privacyMention={ctrl.privacyMention}
                  setPrivacyMention={ctrl.setPrivacyMention}
                  privacyInvites={ctrl.privacyInvites}
                  setPrivacyInvites={ctrl.setPrivacyInvites}
                  syncDevices={ctrl.syncDevices}
                  setSyncDevices={ctrl.setSyncDevices}
                />
              )}

              {ctrl.activeTab === 'search' && (
                <SearchSection
                  globalSearch={ctrl.globalSearch}
                  setGlobalSearch={ctrl.setGlobalSearch}
                  searchMessages={ctrl.searchMessages}
                  setSearchMessages={ctrl.setSearchMessages}
                  searchUsers={ctrl.searchUsers}
                  setSearchUsers={ctrl.setSearchUsers}
                  searchHashtags={ctrl.searchHashtags}
                  setSearchHashtags={ctrl.setSearchHashtags}
                  filterDate={ctrl.filterDate}
                  setFilterDate={ctrl.setFilterDate}
                  filterType={ctrl.filterType}
                  setFilterType={ctrl.setFilterType}
                  filterAuthor={ctrl.filterAuthor}
                  setFilterAuthor={ctrl.setFilterAuthor}
                  savedQueries={ctrl.savedQueries}
                  setSavedQueries={ctrl.setSavedQueries}
                />
              )}

              {ctrl.activeTab === 'media' && (
                <MediaSection
                  imageQuality={ctrl.imageQuality}
                  setImageQuality={ctrl.setImageQuality}
                  autoCompressImages={ctrl.autoCompressImages}
                  setAutoCompressImages={ctrl.setAutoCompressImages}
                  autoPlayVideo={ctrl.autoPlayVideo}
                  setAutoPlayVideo={ctrl.setAutoPlayVideo}
                  autoDownload={ctrl.autoDownload}
                  setAutoDownload={ctrl.setAutoDownload}
                  downloadFolder={ctrl.downloadFolder}
                  setDownloadFolder={ctrl.setDownloadFolder}
                  getPressedStyle={ctrl.getPressedStyle}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
