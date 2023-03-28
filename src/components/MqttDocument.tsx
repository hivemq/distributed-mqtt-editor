import type { Doc } from '@automerge/automerge'
import { Text, change, init, load, merge, save } from '@automerge/automerge'

interface DocumentSchema {
  text: string
}

export class MqttDocument {
  doc!: Doc<DocumentSchema>

  constructor() {
    this.doc = change<DocumentSchema>(init(), (doc: any) => {
      doc.text = new Text()
    })
  }

  update(content: string): string {
    this.doc = change(this.doc, (doc) => {
      doc.text = content
    })

    return this.doc.text
  }

  merge(content: Uint8Array): string {
    this.doc = merge(this.doc, load(content))

    return this.doc.text
  }

  save(): Uint8Array {
    return save(this.doc)
  }
}
