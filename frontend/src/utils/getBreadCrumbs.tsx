import { BreadcrumbProps, Icon } from '@blueprintjs/core';
import logoMono from '../assets/logo-mono.png';

export function generateBreadcrumbs(segments: string[]): BreadcrumbProps[] {
  const crumbs: BreadcrumbProps[] = [];

  let cumulativePath = '';

  // Add "Home" root
  crumbs.push({
    text: 'Home',
    href: '/',
    icon: <img src={logoMono} className="logo" alt="logo" />,
  });

  // Add path segments
  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;

    const isCurrent = index === segments.length - 1;
    crumbs.push({
      text: decodeURIComponent(segment),
      href: cumulativePath,
      current: isCurrent,
      icon: (
        <Icon icon={isCurrent ? 'folder-open' : 'folder-close'} color="black" />
      ),
    });
  });

  return crumbs;
}
