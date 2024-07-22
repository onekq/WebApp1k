import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Post from './userMentionNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a user is mentioned in a post', async () => {
  fetchMock.post('/api/mention', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a post', async () => {
  fetchMock.post('/api/mention', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

