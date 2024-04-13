import React from "react"


const Home = () => (
  <li className="flex-row">
    <a href="/">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
      Home
    </a>
  </li>
)

const Folder = ({name, path} : {name: string, path: string}) => (
  <li className="flex-row">
    <a href={path}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
      </svg>
      {name}
    </a>
  </li>
)

export const Breadcrumbs = ({url} : {url: string}) => {
  const folders = url.split("/").filter((folder) => folder !== "")
  return (
    <div className="breadcrumbs text-sm sticky top-0">
      <ul className="menu menu-horizontal bg-base-200 rounded-box" >
        <Home />
        {
          folders.map((folder, index) => {
            const path = "/" + folders.slice(0, index + 1).join("/")
            return <Folder name={folder} path={path} key={`Breadcrumb-folder-${folder}`}/>
          })
        }
      </ul>
    </div>
  )
}