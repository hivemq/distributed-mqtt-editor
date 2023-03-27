import { useState } from 'react'
import './App.css'
import { Editor } from "./components/Editor";
import {MqttClient, MqttSubscriber} from "./components/MqttClient";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <MqttClient>
            <MqttSubscriber />
            <Editor />
        </MqttClient>
    </div>
  )
}

export default App
