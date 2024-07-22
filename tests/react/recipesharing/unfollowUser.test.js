import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './unfollowUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully unfollow another user', async () => {
  fetchMock.post('/api/unfollow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfollow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unfollow-message')).toBeInTheDocument();
}, 10000);

test('Fail to unfollow another user with error message', async () => {
  fetchMock.post('/api/unfollow-user', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfollow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);