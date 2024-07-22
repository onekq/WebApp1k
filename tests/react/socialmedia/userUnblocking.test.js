import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UnblockUser from './userUnblocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User unblocking succeeds for valid user', async () => {
  fetchMock.post('/api/profile/unblock', { body: { message: 'User unblocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><UnblockUser userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unblock User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User unblocked')).toBeInTheDocument();
}, 10000);

test('User unblocking fails for not blocked user', async () => {
  fetchMock.post('/api/profile/unblock', { body: { error: 'User not blocked' }, status: 400 });

  await act(async () => { render(<MemoryRouter><UnblockUser userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unblock User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User not blocked')).toBeInTheDocument();
}, 10000);

