import { Link, useLocation } from 'react-router-dom';
import {
  Alignment,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';
import { useLocalStorage } from 'usehooks-ts';

import { css } from '@emotion/css';

import { BreadcrumbProps, Icon } from '@blueprintjs/core';
import logoMono from '../../assets/logo-mono.png';
import { HEADER_NAV_HEIGHT } from '../../constants/layout';

export function Header() {
  const { pathname } = useLocation();
  // TODO: fix. `http://192.168.1.192:5173/z/` but the folder in the nav is `http://192.168.1.192:5173/z`
  // which does not provide the folder cover images
  const segments = pathname.split('/').filter(Boolean); // removes empty strings

  const [value, setValue] = useLocalStorage<string>('activeView', 'list');

  const items = generateBreadcrumbs(segments);
  return (
    <Navbar className={styles.navbar}>
      <NavbarGroup
        className={styles.navBarBreadcrumbsContainer}
        align={Alignment.START}
      >
        <Breadcrumbs
          items={items}
          minVisibleItems={1}
          // breadcrumbRenderer={(props) => (
          //   <Link to={props.href ?? '/'}>
          //     <EntityTitle
          //       icon={props.icon}
          //       title={props.text as string}
          //       ellipsize
          //     />
          //   </Link>
          // )}
        />
      </NavbarGroup>

      <NavbarGroup
        className={styles.navbarViewSelectorContainer}
        align={Alignment.END}
      >
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
  const homeCrumb: BreadcrumbProps = {
    text: '',
    href: '/',
    icon: <img src={logoMono} className={styles.logo} alt="logo" />,
  };
  crumbs.push(homeCrumb);

  // Add path segments
  segments.forEach((segment, index) => {
    cumulativePath += `${segment}/`;

    const isCurrent = index === segments.length - 1;
    crumbs.push({
      text: decodeURIComponent(segment),
      href: cumulativePath,
      current: isCurrent,
      // todo: the current folder icon should be its type
      // icon: (
      //   <Icon icon={isCurrent ? 'folder-open' : 'folder-close'} color="black" />
      // ),
    } as BreadcrumbProps);
  });

  return crumbs;
}

const styles = {
  logo: css`
    width: 24px;
    height: 24px;
  `,
  navbar: css`
    min-height: ${HEADER_NAV_HEIGHT}px;
    display: flex;
    width: 100%;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    overflow: scroll;
  `,
  navBarBreadcrumbsContainer: css`
    flex: 1 1 auto;
    min-width: 40px;
    overflow: hidden;
  `,
  navbarViewSelectorContainer: css`
    display: flex;
    flex: 0 0 auto;
    width: 60px;
  `,
};
