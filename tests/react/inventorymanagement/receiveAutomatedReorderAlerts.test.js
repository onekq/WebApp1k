import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './receiveAutomatedReorderAlerts';

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

