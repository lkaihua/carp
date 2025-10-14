import { Link, useLocation } from 'react-router-dom';
import {
  Alignment,
  Breadcrumbs,
  Button,
  ButtonGroup,
  EntityTitle,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';
import { useLocalStorage } from 'usehooks-ts';

import { css } from '@emotion/css';

import { BreadcrumbProps, Icon } from '@blueprintjs/core';
import logoMono from '../../assets/logo-mono.png';

export function Header() {
  const { pathname } = useLocation();
  // TODO: fix. `http://192.168.1.192:5173/z/` but the folder in the nav is `http://192.168.1.192:5173/z`
  // which does not provide the folder cover images
  const segments = pathname.split('/').filter(Boolean); // removes empty strings

  const [value, setValue] = useLocalStorage<string>('activeView', 'list');

  const items = generateBreadcrumbs(segments);
  return (
    <Navbar className="navbar">
      <NavbarGroup className="navbar-header-group">
        <Breadcrumbs
          className="header-breadcrumbs"
          items={items}
          minVisibleItems={1}
          breadcrumbRenderer={(props) => (
            <Link to={props.href ?? '/'}>
              <EntityTitle
                icon={props.icon}
                title={props.text as string}
                ellipsize
              />
            </Link>
          )}
        />
      </NavbarGroup>

      <NavbarGroup className="navbar-group-options" align={Alignment.END}>
        <ButtonGroup>
          <Button
            intent="none"
            icon="list"
            active={value === 'list'}
            onClick={() => setValue('list')}
          />
          <Button
            intent="none"
            icon="grid-view"
            active={value === 'grid'}
            onClick={() => setValue('grid')}
          />
        </ButtonGroup>
      </NavbarGroup>
    </Navbar>
  );
}

function generateBreadcrumbs(segments: string[]): BreadcrumbProps[] {
  const crumbs: BreadcrumbProps[] = [];

  let cumulativePath = '/';

  // Add "Home" root
  crumbs.push({
    text: '',
    href: '/',
    icon: <img src={logoMono} className={styles.logo} alt="logo" />,
  });

  // Add path segments
  segments.forEach((segment, index) => {
    cumulativePath += `${segment}/`;

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

const styles = {
  logo: css`
    width: 24px;
    height: 24px;
  `,
};
