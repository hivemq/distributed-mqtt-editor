import React from 'react'
import { Connector, useMqttState, useSubscription } from 'mqtt-react-hooks';

export function MqttClient(props) {
    const MQTT_OPTIONS: any  = {
        clientId: `distributed-editor/${Math.random()}`,
        protocol: 'wss',
        hostname: import.meta.env.VITE_MQTT_HOSTNAME,
        protocolVersion: 4,
        port: 8884,
        path: '/mqtt',
        clean: true,
        resubscribe: false,
        keepalive: 60,
        reconnectPeriod: 0,
        username: import.meta.env.VITE_MQTT_USERNAME,
        password: import.meta.env.VITE_MQTT_PASSWORD,
    }

    const brokerUrl = `${import.meta.env.VITE_MQTT_HOSTNAME}:8884/mqtt`

    return (
        <Connector brokerUrl={brokerUrl} options={MQTT_OPTIONS}>
            { props.children }
        </Connector>
    );
}


export function MqttSubscriber() {
    const { connectionStatus, client } = useMqttState();

    client?.subscribe('#')

    client?.on('message', (message) => {
        console.log(message);
    })


    return <h1>{`Status: ${connectionStatus}`}</h1>;
}
