import './App.css'
import { Editor } from './components/Editor'
import { MqttClient, MqttSubscriber } from './components/MqttClient'
import { DocumentId } from './components/DocumentId'

function App() {
  return (
        <div className="App">
            <MqttClient>
                <MqttSubscriber/>
                <DocumentId/>
                <Editor/>
            </MqttClient>
        </div>
  )
}

export default App
