import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import logo from './assets/logo.png'
import './App.css'
import { Breadcrumbs } from "@blueprintjs/core";
import { FolderContentData } from './types/proto/types';


function ListPage() {
  // const { path = "" } = useParams();
  const { pathname: path } = useLocation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["list", path],
    queryFn: async () => {
      console.log("Fetching data for path:", path);
      const res = await fetch(`http://localhost:8100${path}`);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { viewCategory, coverImage, displayItems } = data as FolderContentData;
  console.log("Data:", displayItems);

  return (
    <div>
      <h2>List Items</h2>
      <Breadcrumbs
        items={[
          { text: "Blueprint" },
          { text: "Docs" },
          { text: "Components" },
          { text: "Breadcrumbs" },
        ]}
      />
      <ul>
        {Array.isArray(displayItems) ? displayItems.map((item, idx) => (
          <li key={idx}><Link to={item.urlString}>{item.name}</Link></li>
        )) : <li>No items found</li>}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <div>
        <img src={logo} className="logo react" alt="React logo" />
      </div>

      <Routes>
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </div>
  );
}

export default App
