/// <reference types="vite-plugin-svgr/client" />

import './App.css'
import { Editor } from './components/Editor'
import { MqttClient, MqttSubscriber } from './components/MqttClient'
import { DocumentId } from './components/DocumentId'

import { ReactComponent as HiveMQLogo } from './assets/01-hivemq.svg'

function App() {
  return (
        <div className="App">
            <HiveMQLogo className="logo" />
            <MqttClient>
                <MqttSubscriber/>
                <DocumentId/>
                <Editor/>
            </MqttClient>
        </div>
  )
}

export default App
