import { useLocation } from 'react-router-dom';
import {
  Alignment,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Colors,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';

import { css } from '@emotion/css';

import { BreadcrumbProps } from '@blueprintjs/core';
import logoMono from '../../assets/logo-mono.png';
import { HEADER_NAV_HEIGHT } from '../../constants/layout';
import { useActiveView } from '../../utils/useActiveView';
import { useCellMediaRatio } from '../../utils/useCellMediaRatio';
import hexToRgba from 'hex-to-rgba';

export function Header() {
  const { pathname } = useLocation();
  // TODO: fix. `http://192.168.1.192:5173/z/` but the folder in the nav is `http://192.168.1.192:5173/z`
  // which does not provide the folder cover images
  const segments = pathname.split('/').filter(Boolean); // removes empty strings

  const [value, setValue] = useActiveView();
  const [ratio, setRatio] = useCellMediaRatio();

  const items = generateBreadcrumbs(segments);
  return (
    <Navbar className={styles.navbar}>
      <NavbarGroup
        className={styles.navBarBreadcrumbsContainer}
      >
        <Breadcrumbs
          items={items}
          minVisibleItems={1}
        />
      </NavbarGroup>

      <NavbarGroup
        className={styles.navbarViewSelectorContainer}
      >
        {value === 'grid' ? <ButtonGroup>
          <Button
            intent="none"
            icon={ratio === 'square' ? "square" : "rectangle"}
            onClick={() => setRatio(prev => prev === 'square' ? 'ratio' : 'square')}
          />
        </ButtonGroup> : null}

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
    overflow: hidden;
    box-shadow: 0px 0px 0 1px ${hexToRgba(Colors.GRAY1, 0.2)};
  `,
  navBarBreadcrumbsContainer: css`
    flex: 1 1 auto;
    min-width: 40px;
  `,
  navbarViewSelectorContainer: css`
    display: flex;
    flex: 0 0 auto;
    gap: 10px;
    padding-left: 3px;
    background-color: ${hexToRgba(Colors.WHITE, 0.9)};
  `,
};
