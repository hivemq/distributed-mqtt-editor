import { change, init, load, merge, save } from '@automerge/automerge'

export class MqttDocument {
  doc: any

  constructor() {
    this.doc = init()
  }

  update(content: string): string {
    this.doc = change(this.doc, (doc: any) => {
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
