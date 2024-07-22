import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './applicationNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful application notifications.', async () => {
  fetchMock.get('/notifications', [{ message: 'Application Approved' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Approved')).toBeInTheDocument();
}, 10000);

test('failure application notifications.', async () => {
  fetchMock.get('/notifications', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Fetch Notifications')).toBeInTheDocument();
}, 10000);

