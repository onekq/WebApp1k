import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Post from './notificationForLikes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a post is liked', async () => {
  fetchMock.post('/api/like', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a liked post', async () => {
  fetchMock.post('/api/like', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

