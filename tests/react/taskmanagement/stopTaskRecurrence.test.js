import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskRecurrence from './stopTaskRecurrence';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully stops task recurrence.', async () => {
  fetchMock.post('/api/stop-task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><TaskRecurrence /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence stopped successfully')).toBeInTheDocument();
}, 10000);

test('fails to stop task recurrence if server error.', async () => {
  fetchMock.post('/api/stop-task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><TaskRecurrence /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to stop recurrence')).toBeInTheDocument();
}, 10000);

