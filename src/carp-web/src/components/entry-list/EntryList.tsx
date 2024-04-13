import React from "react";
import {DisplayEntry} from "../../app";

export const EntryList = ({entries}: {entries: DisplayEntry[]}) => {
  return (
    <>
      {Array.from(entries).map((entry) => {
        return EntryItem(entry)
      })}
    </>
  )
}


const EntryItem = ({urlString, name}: DisplayEntry) => {
  return (
    <li>
      <a href={urlString}>{name}</a>
    </li>
  )
}
