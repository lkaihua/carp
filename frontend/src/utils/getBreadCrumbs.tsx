import { BreadcrumbProps, Icon } from "@blueprintjs/core";
import { FolderClose } from "@blueprintjs/icons";
// import logo from './assets/logo.png'
import logoMono from '../assets/logo-mono.png'

export function generateBreadcrumbs(segments: string[]): BreadcrumbProps[] {
  const crumbs: BreadcrumbProps[] = [];

  let cumulativePath = "";

  // Add "Home" root
  crumbs.push({
    text: "Home",
    href: "/",
    icon: <><img src={logoMono} className="logo react" alt="logo" /></>,
  });

  // Add path segments
  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;

    const isCurrent = index === segments.length - 1;
    crumbs.push({
      text: decodeURIComponent(segment),
      href: cumulativePath,
      current: isCurrent,
      icon: isCurrent ? undefined : <FolderClose />, // TODO: smartly add file/folder open icon based on content type
    });
  });

  return crumbs;
}