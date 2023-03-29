import React from 'react'

import { ReactComponent as GitHubIcon } from '../assets/github-mark.svg'

export function Navigation(props) {
  return (
        <div className="navigation">
            {props.children}
            <a href="https://github.com/hivemq/distributed-mqtt-editor" className="link" title="Check out the repository">
                <GitHubIcon className="icon" viewBox="0 0 96 98" />
            </a>

        </div>
  )
}
