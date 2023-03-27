export function documentTopic(docId: string): string {
    return `distributed-mqtt-editor/${docId}`
}

export function documentUserTopic(docId: string, senderId: string): string {
    return `distributed-mqtt-editor/${docId}/${senderId}`;
}

