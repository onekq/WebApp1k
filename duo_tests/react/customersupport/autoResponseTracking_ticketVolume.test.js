import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_ticketVolume';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Successfully generates reports on ticket volume.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-result')).toBeInTheDocument();
}, 10000);

test('Fails to generate reports on ticket volume and shows error message.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);