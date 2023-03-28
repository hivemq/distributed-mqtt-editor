import React, { useEffect, useState } from 'react'
import type { UnprivilegedEditor } from 'react-quill'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useMqttState } from 'mqtt-react-hooks'
import { v4 as uuidv4 } from 'uuid'
import QuillCursors from 'quill-cursors'
import { MqttDocument } from './MqttDocument'
import { documentTopic, documentUserCursor, documentUserTopic } from './DocumentTopic'

Quill.register('modules/cursors', QuillCursors)

const QuillModules = { cursors: true }

const document = new MqttDocument()

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface MessageContent {
  text: Uint8Array
  cursor: ReturnType<UnprivilegedEditor['getSelection']>
}

export function Editor() {
  const [value, setValue] = useState('')
  const [senderId] = useState(uuidv4())
  const { connectionStatus, client } = useMqttState()
  const [senderTopic, setSenderTopic] = useState('')
  const [senderCursor, setSenderCursor] = useState('')
  const [mergeInProgress, setMergeInProgress] = useState<boolean>(false)

  /*
   * Store the quill-editor reference to update and edit cursors and other plugins
   */
  const [quillEditorReference, setQuillEditorReference] = useState<ReactQuill | null>(null)

  // Split up the documents by the path name for now
  const documentIdentifier = window.location.pathname.split('/').slice(-1)[0] || ''

  useEffect(() => {
    setSenderTopic(documentUserTopic(documentIdentifier, senderId))
    setSenderCursor(documentUserCursor(documentIdentifier, senderId))
  }, [senderId, documentIdentifier])

  useEffect(() => {
    if (quillEditorReference?.editor) {
      const cursors: QuillCursors = quillEditorReference!.editor!.getModule('cursors')!

      cursors.createCursor(senderId, senderId.split('-')[0], '#FF0000')
    }
  }, [quillEditorReference])

  useEffect(() => {
    if (connectionStatus === 'Connected') {
      client?.subscribe(`${documentTopic(documentIdentifier)}/+`)
      client?.subscribe(`${documentTopic(documentIdentifier)}/+/cursor`)

      client?.on('message', (topic, message) => {
        if (topic.includes('/cursor')) {
          const currentSenderId = topic.split('/').slice(-2)[0]

          if (currentSenderId === senderId)
            return

          console.log(quillEditorReference)

          if (quillEditorReference?.editor) {
            const payload = JSON.parse(new TextDecoder().decode(message))

            const cursors: QuillCursors = quillEditorReference.editor.getModule('cursors')!

            cursors.createCursor(currentSenderId, currentSenderId.split('-')[0], '#00FF00')
            cursors.moveCursor(currentSenderId, payload)
            cursors.toggleFlag(currentSenderId, true)
          }

          return
        }

        try {
          const currentSenderId = topic.split('/').slice(-1)[0]

          if (currentSenderId === senderId)
            return

          setMergeInProgress(true)
          const merged = document.merge(new Uint8Array(message))
          setValue(merged)
        }
        catch (error) {
          console.error(error)
        }
        finally {
          setMergeInProgress(false)
        }
      })

      return () => {
        client?.unsubscribe(documentTopic(documentIdentifier))
      }
    }
  }, [connectionStatus, documentIdentifier, quillEditorReference])

  function onChangeHandler(newValue: string, _delta: any, _source: any, editor: UnprivilegedEditor): void {
    console.log(editor)

    // FIXME for sure it would be great to just wait here until the merge is complete
    if (!mergeInProgress) {
      document.update(newValue)
      const payload = document.save()
      publishTextChange(payload, editor.getSelection())
    }
  }

  function publishTextChange(text: Uint8Array, cursor: ReturnType<UnprivilegedEditor['getSelection']>) {
    client?.publish(senderTopic, text, { qos: 1, retain: false })
    onChangeSelectionHandler(cursor)
  }

  function onChangeSelectionHandler(cursor: ReactQuill.Range) {
    client?.publish(senderCursor, JSON.stringify(cursor), { qos: 1, retain: false })
  }

  return (
      <ReactQuill ref={(el) => {
        setQuillEditorReference(el)
      }} theme="snow" value={value} onChange={onChangeHandler} modules={QuillModules} onChangeSelection={onChangeSelectionHandler} />
  )
}
