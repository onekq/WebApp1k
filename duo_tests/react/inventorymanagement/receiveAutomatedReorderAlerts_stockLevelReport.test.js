import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './receiveAutomatedReorderAlerts_stockLevelReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sends automated reorder alert when stock falls below level', async () => {
  fetchMock.get('/api/stock/monitor', { stock: 10, reorderLevel: 20 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Automated reorder alert sent/i)).toBeInTheDocument();
}, 10000);

test('Shows error on failure when sending automated reorder alerts', async () => {
  fetchMock.get('/api/stock/monitor', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Error sending automated reorder alert/i)).toBeInTheDocument();
}, 10000);

test('Generates stock level report successfully.', async () => {
  fetchMock.post('/api/stock-level-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate stock level report due to server error.', async () => {
  fetchMock.post('/api/stock-level-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);