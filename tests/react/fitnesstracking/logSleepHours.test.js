import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logSleepHours';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('logs sleep hours successfully and displays hours in the list', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);

