import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationSystem';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully notify user of a new comment.', async () => {
  fetchMock.get('/api/notifications', { status: 200, body: { notifications: ['New comment on your photo!'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notifications-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New comment on your photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to fetch notifications.', async () => {
  fetchMock.get('/api/notifications', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notifications-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
}, 10000);