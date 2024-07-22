import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ReceivePropertyAlerts from './receivePropertyAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully receives property alerts', async () => {
  fetchMock.get('/api/alerts', 200);

  await act(async () => { render(<MemoryRouter><ReceivePropertyAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
}, 10000);

test('fails to receive property alerts and shows error message', async () => {
  fetchMock.get('/api/alerts', 500);

  await act(async () => { render(<MemoryRouter><ReceivePropertyAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-error')).toBeInTheDocument();
}, 10000);

