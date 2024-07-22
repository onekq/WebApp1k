import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskApp from './setUserRoles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set user roles successfully', async () => {
  fetchMock.post('/set-user-roles', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Role assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user roles due to server error', async () => {
  fetchMock.post('/set-user-roles', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Error assigning role')).toBeInTheDocument();
}, 10000);

