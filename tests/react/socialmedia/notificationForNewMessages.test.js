import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Messages from './notificationForNewMessages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a user receives a new message', async () => {
  fetchMock.post('/api/message', { success: true });

  await act(async () => { render(<MemoryRouter><Messages /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('message-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a new message', async () => {
  fetchMock.post('/api/message', 500);

  await act(async () => { render(<MemoryRouter><Messages /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('message-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

