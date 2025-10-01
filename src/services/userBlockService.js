import { apiRequest } from '../utils/apiUtils'

export const blockUser = async (blockedUserId, reason = '') => {
  return apiRequest('/user-blocks/', {
    method: 'POST',
    body: JSON.stringify({
      blocked_user_id: blockedUserId,
      reason: reason
    })
  })
}

export const unblockUser = async (blockedUserId) => {
  return apiRequest(`/user-blocks/${blockedUserId}`, {
    method: 'DELETE'
  })
}

export const getBlockedUsers = async (skip = 0, limit = 50) => {
  return apiRequest(`/user-blocks/blocked?skip=${skip}&limit=${limit}`)
}
