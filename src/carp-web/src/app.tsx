import React, {useEffect, useState} from 'react'
import './app.css'
// import { Back } from './components/back/Back'
// import carpLogo from './assets/carplogo.svg'
// import {usePrevious} from "@uidotdev/usehooks"
import {create} from "zustand";
import {Breadcrumbs} from "./components/breadcrumbs/Breadcrumbs";
// import {Navbar} from "./components/navbar/Navbar.js";
// import {EntryList} from "./components/entry-list/EntryList.js";
import axios from "axios"
import { useLocation } from 'react-router-dom';
import {EntryList} from "./components/entry-list/EntryList";

// const useCount = create(set => ({
//   count: 0,
//   increment: () => set(state => ({ count: state.count + 1 })),
// }))

declare global {
  interface Window { CARP_DIR_LIST: any[]; }
}

interface Entry {
  name: string
  firstName: string

}

/**
 * type DisplayEntry struct {
 *    Name          string    `json:"name"`          // file full name after html escaped
 *    FirstName     string    `json:"firstName"`     // without extension
 *    LastName      string    `json:"lastName"`      // extension string if it's a file, or "/" if it's a folder
 *    EntryType     EntryType `json:"entryType"`     // entry type might be folder, image, video, music, etc.
 *    Children      string    `json:"children"`      // children of this folder in json
 *    UrlString     string    `json:"urlString"`     // URL string for this entry
 *    ModTimeString string    `json:"modTimeString"` // last modified time human-readable string
 *    ModTimeUnix   int64     `json:"modTimeUnix"`   // last modified time in unix time, used for sorting
 *    SizeString    string    `json:"sizeString"`    // file size human-readable string
 *    SizeInt       int64     `json:"sizeInt"`       // file size in int64, used for sorting
 * }
 */
export interface DisplayEntry {
  name: string
  firstName: string
  lastName: string
  entryType: string
  children: string
  urlString: string
  modTimeString: string
  modTimeUnix: number
  sizeString: string
  sizeInt: number
}

interface AppState {
  currentFolder: string,
  entries: DisplayEntry[],
  errors: string[],
  isLoading: boolean,
  updateCurrentFolder: (folder: string) => void,
  updateEntries: (entries: DisplayEntry[]) => void,
  updateIsLoading: (isLoading: boolean) => void,
}

const useAppStore = create<AppState>(set => ({
  currentFolder: '',
  entries: window.CARP_DIR_LIST || [],
  errors: [],
  isLoading: false,
  updateCurrentFolder: (folder: string) => set({ currentFolder: folder }),
  updateEntries: (entries: DisplayEntry[]) => set({ entries: entries }),
  updateIsLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}))



export function App() {
  // const [count, setCount] = useState(0)
  // const { count, increment } = useCount()
  // const

  // A global state to show if the full screen player is on
  // const fullScreen = signal(false)

  // Read from the global or call the JSON api
  // const dirList = signal(window.CARP_DIR_LIST || [])

  // const [dir, setDir] = useState('')
  // const previousDir = usePrevious(dir)

  const {currentFolder,  entries, isLoading, updateCurrentFolder, updateEntries, updateIsLoading} = useAppStore()

  useEffect(() => {
    const fetchEntries = async () => {
      updateIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:8100/${currentFolder}?format=json`);
        updateEntries(response.data)
      } catch (err) {
        console.log(err)
        updateEntries([])
      } finally {
        updateIsLoading(false)
      }
    };

    fetchEntries();
  }, [currentFolder]);

  const loc = useLocation();
  useEffect(() => {
    console.log('loc changed: ', loc)
    updateCurrentFolder(loc.pathname)
  }, [loc]);

  return (
    <div className="px-2">

      {/*<Navbar />*/}

      <Breadcrumbs url={"/Photos/Test1/Test2/"}/>


      {isLoading ? <div>Loading...</div> : <EntryList entries={entries}/>}


      {/*<span className="underline">{count}</span>*/}
      {/*<div className="card">*/}
      {/*  <button className="" onClick={increment}>*/}
      {/*    +*/}
      {/*  </button>*/}
      {/*  <p>*/}
      {/*    Edit <code>src/app.jsx</code> and save to test HMR*/}
      {/*  </p>*/}
      {/*</div>*/}
      {/*<p className="read-the-docs">*/}
      {/*  Click on the Vite and Preact logos to learn more*/}
      {/*</p>*/}
    </div>
  )
}

