import React from 'react'

export function Configuration() {
  const docId = window.location.pathname.split('/').pop()

  return (
      <div className="configuration">
          <table>
              <thead>
                <tr>
                    <th>Configuration</th>
                    <th>Option</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td>Document ID</td>
                    <td>{docId}</td>
                </tr>
                <tr>
                    <td>Hostname</td>
                    <td>{import.meta.env.VITE_MQTT_HOSTNAME}</td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td>{import.meta.env.VITE_MQTT_USERNAME}</td>
                </tr>
              </tbody>
          </table>
        <h1></h1>
      </div>
  )
}
