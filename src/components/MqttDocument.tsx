import * as Automerge from '@automerge/automerge';

export class MqttDocument {
    doc: any;

    constructor() {
        this.doc = Automerge.init()
    }

    update(content: string): string {
        this.doc = Automerge.change(this.doc, (doc: any) => {
            doc.text = content
        })
        return this.doc.text;
    }

    merge(content: Uint8Array): string {
        this.doc = Automerge.merge(this.doc, Automerge.load(content));
        return this.doc.text;
    }

    save(): Uint8Array {
        return Automerge.save(this.doc);
    }
}
