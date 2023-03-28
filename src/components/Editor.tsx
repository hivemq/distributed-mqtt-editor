import React, { useEffect, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useMqttState } from 'mqtt-react-hooks'
import { v4 as uuidv4 } from 'uuid'
import QuillCursors from 'quill-cursors'
import { MqttDocument } from './MqttDocument'
import { documentTopic, documentUserTopic } from './DocumentTopic'

Quill.register('modules/cursors', QuillCursors)

const QuillModules = { cursors: true }

const document = new MqttDocument()

export function Editor() {
  const [value, setValue] = useState('')
  const [senderId, setSenderId] = useState(uuidv4())
  const { connectionStatus, client } = useMqttState()
  const [senderTopic, setSenderTopic] = useState('')
  const [mergeInProgress, setMergeInProgress] = useState<boolean>(false)
  let quillRef = null
  let editor: typeof Quill | undefined

  const docId = window.location.pathname.split('/').pop()!

  useEffect(() => {
    setSenderTopic(documentUserTopic(docId, senderId))
  }, [senderId, docId])

  useEffect(() => {
    console.log('quillRef', quillRef!.editor)
    const cursors: QuillCursors = quillRef!.editor!.getModule('cursors')!
    cursors.createCursor('someid', 'me', '#FF0000')
    cursors.moveCursor('someid', { index: 1, length: 0 })
    cursors.toggleFlag('someid', true)
  }, [quillRef])

  useEffect(() => {
    if (connectionStatus === 'Connected') {
      client?.subscribe(`${documentTopic(docId)}/+`)

      client?.on('message', (topic, message) => {
        const currentSenderId = topic.split('/').pop()

        if (currentSenderId === senderId)
          return

        try {
          setMergeInProgress(true)
          const merged = document.merge(new Uint8Array(message))
          setValue(merged)
        }
        finally {
          setMergeInProgress(false)
        }
      })

      return () => {
        client?.unsubscribe(documentTopic(docId))
      }
    }
  }, [connectionStatus, docId])

  function onChangeHandler(newValue: string): void {
    // FIXME for sure it would be great to just wait here until the merge is complete
    if (!mergeInProgress) {
      const updated = document.update(newValue)
      setValue(updated)

      const payload = document.save()
      broadcastText(payload)
    }
  }

  function broadcastText(text: ArrayBuffer) {
    client?.publish(senderTopic, text, { qos: 1, retain: false })
  }

  return (
        <ReactQuill ref={(el) => {
          quillRef = el
        }} theme="snow" value={value} onChange={onChangeHandler} modules={QuillModules} />
  )
}
