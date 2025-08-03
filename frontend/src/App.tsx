import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import logo from './assets/logo.png'
import './App.css'
import { Breadcrumbs, BreadcrumbProps, Button, CardList, Card } from "@blueprintjs/core";
import { FolderContentData } from './types/proto/types';


import VideoPlayer from "./components/VideoPlayer/VideoPlayer";


function generateBreadcrumbs(pathname: string): BreadcrumbProps[] {
  const segments = pathname.split("/").filter(Boolean); // removes empty strings
  const crumbs: BreadcrumbProps[] = [];

  let cumulativePath = "";

  // Add "Home" root
  crumbs.push({
    text: "Home",
    href: "/",
  });

  // Add path segments
  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;

    crumbs.push({
      text: decodeURIComponent(segment),
      href: cumulativePath + "/", // ensure trailing slash
    });
  });

  return crumbs;
}

function HeaderBreadcrumbs() {
  const { pathname } = useLocation();
  const breadcrumbs = generateBreadcrumbs(pathname);
  return <Breadcrumbs
    items={breadcrumbs}
    breadcrumbRenderer={(props) => (<Link to={props.href ?? "/"}>{props.text}</Link>)}
  />
}

function ListPage() {
  // const { path = "" } = useParams();
  const { hostname } = window.location;
  const { pathname } = useLocation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["list", pathname],
    queryFn: async () => {
      const headRes = await fetch(`//192.168.1.192:8100${pathname}`, {
        method: "HEAD",
      });

      if (!headRes.ok) throw new Error("HEAD request failed");

      const contentType = headRes.headers.get("Content-Type") || "";

      if (contentType.includes("application/json")) {
        const jsonRes = await fetch(`//192.168.1.192:8100${pathname}`);
        return jsonRes.json();
      }

      if (contentType.startsWith("video/") || contentType.includes("mpegurl")) {
        return {
          videoUrl: `//192.168.1.192:8100${pathname}`,
          type: contentType,
        };
      }

      throw new Error(`Unsupported content type: ${contentType}`);
    },
    retry: false, // Disable retry for simplicity
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // console.log("Data:", displayItems);
  if ("videoUrl" in data) {
    // return <VideoPlayer src={data.videoUrl} type={data.type} />;
    return <video src={data.videoUrl} controls width="300" />;
  }

  const { viewCategory, coverImage, displayItems } = data as FolderContentData;
  if (Array.isArray(displayItems)) {
    return (
      <div>
        <CardList>
          {
            displayItems.map((item, idx) => (
              <Card key={idx}>
                <Link to={item.urlString}>{item.name}</Link>
              </Card>
            ))
          }
        </CardList>
      </div >
    );
  }


}

function App() {
  return (
    <div>
      <div>
        <img src={logo} className="logo react" alt="React logo" />
      </div>

      <HeaderBreadcrumbs />

      <Routes>
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </div >
  );
}

export default App
