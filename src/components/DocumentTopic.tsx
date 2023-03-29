const topicPrefix = import.meta.env.VITE_MQTT_TOPIC_PREFIX

export function documentTopic(docId: string): string {
  return `${topicPrefix}/${docId}`
}

export function documentUserTopic(docId: string, senderId: string): string {
  return `${topicPrefix}/${docId}/${senderId}`
}

export function documentUserCursor(docId: string, senderId: string): string {
  return `${topicPrefix}/${docId}/${senderId}/cursor`
}
