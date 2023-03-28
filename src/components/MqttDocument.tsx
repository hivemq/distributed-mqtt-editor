import type { Change, Doc } from '@automerge/automerge'
import { Text, change, getChanges, init, load, merge, save } from '@automerge/automerge'

interface DocumentSchema {
  text: Text
}

interface DocumentUpdated {
  text: Text
  changes: Change[]
}

export class MqttDocument {
  doc!: Doc<DocumentSchema>

  constructor() {
    this.doc = change<DocumentSchema>(init(), (doc: any) => {
      doc.text = new Text()
    })
  }

  update(content: string): DocumentUpdated {
    const newDoc = change(this.doc, (doc) => {
      doc.text = new Text(content)
    })

    const changes = getChanges(this.doc, newDoc)
    this.doc = newDoc

    return { text: this.doc.text, changes }
  }

  merge(content: Uint8Array): DocumentSchema {
    this.doc = merge(this.doc, load(content))

    return this.doc
  }

  save(): Uint8Array {
    return save(this.doc)
  }
}
