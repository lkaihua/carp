import React, { useState } from 'react'
import {signal} from "@preact/signals-react"
import './app.css'
import { Back } from './components/back/Back'
import carpLogo from './assets/carplogo.svg'
import carpLogo2 from './assets/image150.png'
import {usePrevious} from "@uidotdev/usehooks";

export function App() {
  // const [count, setCount] = useState(0)

  const count = signal(0)

  const increment = () => {
    count.value = count.value + 1
  }

  // A global state to show if the full screen player is on
  const fullScreen = signal(false)

  // Read from the global or call the JSON api
  const dirList = signal(window.CARP_DIR_LIST || [])

  const [dir, setDir] = useState('')
  const previousDir = usePrevious(dir)

  return (
    <>
      <Back />
      <div>
        <a href="https://preactjs.com" target="_blank">
          <img src={carpLogo} className="logo" alt="carp logo" />
          <img src={carpLogo2} className="logo" alt="carp logo" />
        </a>
      </div>
      <h1>Carp</h1>
      <span>{count}</span>
      <div className="card">
        <button onClick={increment}>
          +
        </button>


        <p>
          Edit <code>src/app.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  )
}

