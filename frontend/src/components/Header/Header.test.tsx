import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { Header } from './Header';

describe('Header display controls', () => {
  beforeEach(() => localStorage.clear());

  it('enables grid media choices only in grid view', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/~/']}>
        <Header />
      </MemoryRouter>,
    );

    const view = screen.getByRole('group', { name: 'View' });
    const gridMedia = screen.getByRole('group', { name: 'Grid media' });

    expect(within(view).getByRole('button', { name: 'List' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      within(gridMedia).getByRole('button', { name: 'Fill' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(gridMedia).getByRole('button', { name: 'Fill' }),
    ).toBeDisabled();
    expect(
      within(gridMedia).getByRole('button', { name: 'Fit' }),
    ).toBeDisabled();

    await user.click(within(view).getByRole('button', { name: 'Grid' }));
    expect(
      within(gridMedia).getByRole('button', { name: 'Fit' }),
    ).toBeEnabled();

    await user.click(within(gridMedia).getByRole('button', { name: 'Fit' }));
    expect(
      within(gridMedia).getByRole('button', { name: 'Fit' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('CellMediaRatio')).toBe('"ratio"');

    await user.click(within(view).getByRole('button', { name: 'List' }));
    expect(within(view).getByRole('button', { name: 'List' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      within(gridMedia).getByRole('button', { name: 'Fit' }),
    ).toBeDisabled();
  });
});
