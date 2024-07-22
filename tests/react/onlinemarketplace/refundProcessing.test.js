import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './refundProcessing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('processes refund successfully.', async () => {
  fetchMock.post('/api/refund', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on refund processing failure.', async () => {
  fetchMock.post('/api/refund', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processing failed')).toBeInTheDocument();
}, 10000);

