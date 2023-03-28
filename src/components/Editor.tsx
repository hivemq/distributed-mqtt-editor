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

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function Editor() {
  const [value, setValue] = useState('')
  const [senderId] = useState(uuidv4())
  const { connectionStatus, client } = useMqttState()
  const [senderTopic, setSenderTopic] = useState('')
  const [mergeInProgress, setMergeInProgress] = useState<boolean>(false)

  /*
   * Store the quill-editor reference to update and edit cursors and other plugins
   */
  let quillEditorReference: ReactQuill | null = null

  // Split up the documents by the path name for now
  const documentIdentifier = window.location.pathname.split('/').slice(-1)[0] || ''

  useEffect(() => {
    setSenderTopic(documentUserTopic(documentIdentifier, senderId))
  }, [senderId, documentIdentifier])

  useEffect(() => {
    if (quillEditorReference?.editor) {
      const cursors: QuillCursors = quillEditorReference.editor.getModule('cursors')!

      cursors.createCursor('someid', 'me', '#FF0000')
      cursors.moveCursor('someid', { index: 1, length: 0 })
      cursors.toggleFlag('someid', true)

      setInterval(() => {
        cursors.moveCursor('someid', { index: generateRandomInteger(1, 10), length: generateRandomInteger(0, 30) })
      }, 2000)
    }
  }, [quillEditorReference])

  useEffect(() => {
    if (connectionStatus === 'Connected') {
      client?.subscribe(`${documentTopic(documentIdentifier)}/+`)

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
        client?.unsubscribe(documentTopic(documentIdentifier))
      }
    }
  }, [connectionStatus, documentIdentifier])

  function onChangeHandler(newValue: string): void {
    // FIXME for sure it would be great to just wait here until the merge is complete
    if (!mergeInProgress) {
      const updated = document.update(newValue)
      setValue(updated)

      const payload = document.save()
      publishTextChange(payload)
    }
  }

  function publishTextChange(text: ArrayBuffer) {
    client?.publish(senderTopic, text, { qos: 1, retain: false })
  }

  return (
      <ReactQuill ref={(el) => {
        quillEditorReference = el
      }} theme="snow" value={value} onChange={onChangeHandler} modules={QuillModules} />
  )
}
