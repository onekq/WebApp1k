import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './rma';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Return Merchandise Authorization (RMA) success initiates RMA process', async () => {
  fetchMock.post('/api/orders/1/rma', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(fetchMock.calls('/api/orders/1/rma').length).toBe(1);
  expect(screen.getByText('RMA initiated')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) failure shows error message', async () => {
  fetchMock.post('/api/orders/1/rma', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(screen.getByText('Error initiating RMA')).toBeInTheDocument();
}, 10000);

