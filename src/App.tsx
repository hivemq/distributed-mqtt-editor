/// <reference types="vite-plugin-svgr/client" />

import './App.css'
import { Editor } from './components/Editor'
import { ConnectionStatus, MqttClient } from './components/MqttClient'
import { Configuration } from './components/Configuration'

import { ReactComponent as HiveMQLogo } from './assets/01-hivemq.svg'
import { Navigation } from './components/Navigation'

function App() {
  return (
        <div className="App">
            <MqttClient>
                <div className="container">
                    <a href="https://www.hivemq.com/" title="HiveMQ Website" className="link">
                        <HiveMQLogo className="logo" />
                    </a>

                    <div className="navigation">
                        <Navigation>
                            <ConnectionStatus />
                        </Navigation>
                    </div>

                    <hr className="divider" />

                    <div className="content">
                        <h1 className="content-title">Distributed MQTT Text Editor</h1>

                        <p className="content-description">
                            Learn how we build this decentralized collaborative <a href="https://www.hivemq.com/blog/decentralized-collaborative-text-editor-using-mqtt-crdts/">text editor</a> using the MQTT protocol and CRDTs
                                it our blog post. Feel free to download this <a href="https://github.com/hivemq/distributed-mqtt-editor">repository on GitHub</a> and connect the Demo to our free and private <a href="https://console.hivemq.cloud/?utm_source=decentralized-collaborative-text-editor-demo&utm_medium=link&utm_campaign=in_product">HiveMQ Cloud</a> instance.
                        </p>
                    </div>

                    <Editor />

                    <Configuration />
                </div>
            </MqttClient>
        </div>
  )
}

export default App
