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
                            <b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the <i>industry's</i> standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and <a href="https://www.hivemq.com/">scrambled</a> it to make a type specimen book.
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
