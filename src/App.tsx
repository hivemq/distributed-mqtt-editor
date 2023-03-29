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

                    <div className="connection-details">
                        <Navigation>
                            <ConnectionStatus />
                        </Navigation>
                    </div>

                    <Editor />

                    <Configuration />
                </div>
            </MqttClient>
        </div>
  )
}

export default App
