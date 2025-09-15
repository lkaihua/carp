import { Link, useLocation } from 'react-router-dom';
import { generateBreadcrumbs } from '../../utils/getBreadCrumbs';
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

import './Header.css'; // Ensure styles are applied

export function Header() {
  const { pathname } = useLocation();
  // TODO: fix. `http://192.168.1.192:5173/z/` but the folder in the nav is `http://192.168.1.192:5173/z`
  // which does not provide the folder cover images
  const segments = pathname.split('/').filter(Boolean); // removes empty strings

  const [value, setValue] = useLocalStorage<string>('activeView', 'list');

  const breadcrumbs = generateBreadcrumbs(segments);
  return (
    <Navbar className="navbar">
      <NavbarGroup className="navbar-header-group">
        <Breadcrumbs
          className="header-breadcrumbs"
          items={breadcrumbs}
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
