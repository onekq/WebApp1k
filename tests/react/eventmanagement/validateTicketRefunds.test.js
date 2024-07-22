import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateTicketRefunds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('processes ticket refund successfully', async () => {
  fetchMock.post('/processRefund', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(fetchMock.calls('/processRefund').length).toEqual(1);
  expect(screen.getByText('Refund processed')).toBeInTheDocument();
}, 10000);

test('fails to process ticket refund', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(screen.getByText('Unable to process refund.')).toBeInTheDocument();
}, 10000);