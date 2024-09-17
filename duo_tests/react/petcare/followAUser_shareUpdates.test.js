import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './followAUser_shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully follows a user', async () => {
  fetchMock.post('/api/users/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to follow a user', async () => {
  fetchMock.post('/api/users/follow', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to follow user')).toBeInTheDocument();
}, 10000);

test('Successfully shares updates with the community', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);