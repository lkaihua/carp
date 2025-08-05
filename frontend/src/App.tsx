import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Breadcrumbs, BreadcrumbProps, Button, CardList, Card, Callout, Drawer, Tag, Icon, EntityTitle } from "@blueprintjs/core";
import { FolderContentData } from './types/proto/types';
import { Add, Download, FolderClose, FolderOpen, Home, Video } from "@blueprintjs/icons";
// import VideoPlayer from "./components/VideoPlayer/VideoPlayer";

import './App.css'
import { getParentFolderPath } from './utils/getParentFolderPath';
import { generateBreadcrumbs } from './utils/getBreadCrumbs';
import { VideoPlayer } from './components/VideoPlayer';
import { Photo } from './components/Photo';



function HeaderBreadcrumbs({ segments }: { segments: string[] }) {
  const breadcrumbs = generateBreadcrumbs(segments);
  return <Breadcrumbs
    className="header-breadcrumbs"
    items={breadcrumbs}
    breadcrumbRenderer={(props) => (<Link to={props.href ?? "/"}><EntityTitle icon={props.icon} title={props.text as string} ellipsize /></Link>)}
  // currentBreadcrumbRenderer={(props) => (
  //   <span className="bp3-breadcrumbs-current">{props.text}</span>
  // )}
  />
}

function ListPage() {
  // const {path = ""} = useParams();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean); // removes empty strings

  const { data, isLoading, error } = useQuery({
    queryKey: ["list", pathname],
    queryFn: async () => {
      const baseUrl = `//192.168.1.192:8100${pathname}`;

      let headRes: Response;
      try {
        headRes = await fetch(baseUrl, { method: "HEAD" });
      } catch (err) {
        throw new Error(`HEAD request failed: ${err}`);
      }

      if (!headRes.ok) {
        throw new Error(`HEAD request failed with status ${headRes.status}`);
      }

      const contentType = headRes.headers.get("Content-Type") || "";
      console.log("Content-Type:", contentType);

      // Handle JSON
      if (contentType.includes("application/json")) {
        try {
          const jsonRes = await fetch(baseUrl);
          if (!jsonRes.ok) {
            throw new Error(`GET request failed with status ${jsonRes.status}`);
          }
          return await jsonRes.json();
        } catch (err) {
          throw new Error(`Failed to fetch or parse JSON: ${err}`);
        }
      }

      if (contentType.startsWith("video/") || contentType.includes("mpegurl")) {
        return { videoUrl: baseUrl, type: contentType };
      }

      if (contentType.startsWith("image/")) {
        return { imageUrl: baseUrl, type: contentType };
      }

      if (!!contentType) {
        throw new Error(`Unsupported content type: ${contentType} `);
      }
      throw new Error("No content found");
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <Callout intent="danger">Error: {error.message}</Callout>;

  let fileContent: JSX.Element | null = null;

  const parentFolderPath = getParentFolderPath(segments)
  if ("videoUrl" in data) {
    // return <VideoPlayer src={data.videoUrl} type={data.type} />;
    // fileContent = <Drawer position='bottom' size="95%"
    //   title={decodeURIComponent(segments.at(-1) ?? "")} usePortal icon={<Video />} onClose={() => {
    //     navigate(getParentFolderPath(segments));
    //   }} isOpen={true}>
    //   <video src={data.videoUrl} controls autoPlay muted width="100%" />
    // </Drawer>;
    fileContent = (
      <VideoPlayer src={data.videoUrl} onCloseNavigateTo={parentFolderPath} />
    )
  }

  if ("imageUrl" in data) {
    fileContent = <Photo src={data.imageUrl} onCloseNavigateTo={parentFolderPath} />;
  }

  let listContent: JSX.Element | null = null;
  const { viewCategory, coverImage, displayItems } = data as FolderContentData;
  if (Array.isArray(displayItems)) {
    listContent = (
      <CardList>
        {
          displayItems.map((item, idx) => (
            <Card key={idx}>
              <Link to={item.urlString}>{item.name}</Link>
            </Card>
          ))
        }
      </CardList>
    );
  }

  return (
    <div className="list-page">
      <HeaderBreadcrumbs segments={segments} />
      <div className="content">
        {fileContent}
        {listContent}
      </div>
    </div>
  )

}

function App() {
  return (
    <div className="carp-app">
      {/* <div>
        <img src={logo} className="logo react" alt="React logo" />
      </div> */}

      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path=":path/*" element={<ListPage />} />
      </Routes>
    </div >
  );
}

export default App
