import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {MqttDocument} from "./MqttDocument";
import {useMqttState} from "mqtt-react-hooks";
import {documentTopic, documentUserTopic} from "./DocumentTopic";
import {v4 as uuidv4} from 'uuid';

const document = new MqttDocument();

export function Editor() {
    const [value, setValue] = useState('');
    const [senderId, setSenderId] = useState(uuidv4());
    const {connectionStatus, client} = useMqttState();
    const [senderTopic, setSenderTopic] = useState('');
    const [mergeInProgress, setMergeInProgress] = useState<boolean>(false);

    const docId = window.location.pathname.split("/").pop()!!

    useEffect(() => {
        setSenderTopic(documentUserTopic(docId, senderId))
    }, [senderId, docId]);

    useEffect(() => {
        if (connectionStatus === "Connected") {
            client?.subscribe(documentTopic(docId) + '/+');

            client?.on("message", (topic, message) => {
                const currentSenderId = topic.split('/').pop();

                if (currentSenderId === senderId) {
                    return;
                }

                try {
                    setMergeInProgress(true);
                    let merged = document.merge(new Uint8Array(message))
                    setValue(merged);
                } finally {
                    setMergeInProgress(false);
                }
            })

            return () => {
                client?.unsubscribe(documentTopic(docId))
            };
        }
    }, [connectionStatus, docId]);


    function onChangeHandler(newValue: string): void {
        // FIXME for sure it would be great to just wait here until the merge is complete
        if (!mergeInProgress) {
            let updated = document.update(newValue);
            setValue(updated);

            const payload = document.save();
            broadcastText(payload)
        }
    }

    function broadcastText(text: ArrayBuffer) {
        client?.publish(senderTopic, text, {qos: 1, retain: false})
    }

    return (
        <ReactQuill theme="snow" value={value} onChange={onChangeHandler}/>
    )
}
