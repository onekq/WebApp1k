import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateScheduledBreaks';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { error: 'Breaks are incorrectly scheduled' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks are incorrectly scheduled')).toBeInTheDocument();
}, 10000);

