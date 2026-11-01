import { useLocation } from 'react-router-dom';
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Colors,
  Icon,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';

import { css } from '@emotion/css';

import { BreadcrumbProps } from '@blueprintjs/core';
import logoMono from '../../assets/logo-mono.png';
import {
  HEADER_NAV_HEIGHT,
  MOBILE_HEADER_NAV_HEIGHT,
} from '../../constants/layout';
import { useActiveView } from '../../utils/useActiveView';
import { useCellMediaRatio } from '../../utils/useCellMediaRatio';
import hexToRgba from 'hex-to-rgba';

export function Header() {
  const { pathname } = useLocation();
  // TODO: fix. `http://192.168.1.192:5173/z/` but the folder in the nav is `http://192.168.1.192:5173/z`
  // which does not provide the folder cover images
  const segments = pathname.split('/').filter(Boolean); // removes empty strings

  const [view, setView] = useActiveView();
  const [ratio, setRatio] = useCellMediaRatio();

  const items = generateBreadcrumbs(segments);
  return (
    <Navbar className={styles.navbar}>
      <NavbarGroup className={styles.navBarBreadcrumbsContainer}>
        <Breadcrumbs items={items} minVisibleItems={1} />
      </NavbarGroup>

      <NavbarGroup className={styles.navbarViewSelectorContainer}>
        <div className={styles.controlGroup} role="group" aria-label="View">
          <Icon
            icon="page-layout"
            size={16}
            color={Colors.GRAY1}
            title="View"
          />
          <ButtonGroup>
            <Button
              intent="none"
              icon="list"
              text="List"
              active={view === 'list'}
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            />
            <Button
              intent="none"
              icon="grid-view"
              text="Grid"
              active={view === 'grid'}
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            />
          </ButtonGroup>
        </div>

        <div
          className={styles.controlGroup}
          role="group"
          aria-label="Grid media"
          title={
            view === 'list' ? 'Switch to Grid to change tile media' : undefined
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={Colors.GRAY1}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect
              x="1.15"
              y="1.15"
              width="13.7"
              height="13.7"
              rx="1.2"
              strokeWidth="1.9"
            />
            <path d="M1.15 3.8h13.7M1.15 12.5h13.7M1.5 11.5l4-4 3 3 2-2 3 3" />
            <circle
              cx="11.5"
              cy="6.3"
              r="0.7"
              fill={Colors.GRAY1}
              stroke="none"
            />
          </svg>
          <ButtonGroup>
            <Button
              intent="none"
              icon="square"
              text="Fill"
              title="Fill grid tiles, cropping media when needed"
              active={ratio === 'square'}
              aria-pressed={ratio === 'square'}
              disabled={view !== 'grid'}
              onClick={() => setRatio('square')}
            />
            <Button
              intent="none"
              icon="rectangle"
              text="Fit"
              title="Fit entire media inside grid tiles"
              active={ratio === 'ratio'}
              aria-pressed={ratio === 'ratio'}
              disabled={view !== 'grid'}
              onClick={() => setRatio('ratio')}
            />
          </ButtonGroup>
        </div>
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
    icon: <img src={logoMono} width="24" height="24" alt="logo" />,
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
  navbar: css`
    min-height: ${HEADER_NAV_HEIGHT}px;
    display: flex;
    width: 100%;
    padding: 0;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    box-shadow: 0px 0px 0 1px ${hexToRgba(Colors.GRAY1, 0.2)};
    @media (max-width: 700px) {
      height: ${MOBILE_HEADER_NAV_HEIGHT}px;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      overflow: visible;
    }
  `,
  navBarBreadcrumbsContainer: css`
    flex: 1 1 auto;
    min-width: 40px;
    padding: 0 20px;
    @media (max-width: 700px) {
      flex: 0 0 ${HEADER_NAV_HEIGHT}px;
      min-width: 0;
      width: 100%;
    }
  `,
  navbarViewSelectorContainer: css`
    display: flex;
    flex: 0 0 auto;
    gap: 16px;
    padding: 0 20px;
    background-color: ${hexToRgba(Colors.WHITE, 0.9)};
    @media (max-width: 700px) {
      flex: 0 0 ${MOBILE_HEADER_NAV_HEIGHT - HEADER_NAV_HEIGHT}px;
      width: 100%;
      justify-content: flex-end;
      border-top: 1px solid ${hexToRgba(Colors.GRAY1, 0.1)};
      padding-left: 0;
    }
  `,
  controlGroup: css`
    display: flex;
    align-items: center;
    gap: 6px;
    @media (max-width: 700px) {
      .bp6-button .bp6-icon {
        display: none;
      }
    }
  `,
};
