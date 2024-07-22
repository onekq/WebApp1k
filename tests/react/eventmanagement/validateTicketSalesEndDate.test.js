import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateTicketSalesEndDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ticket sales end date before event start date', async () => {
  fetchMock.post('/ticketSalesEndDate', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketSalesEndDate').length).toEqual(1);
  expect(screen.getByText('Sales end date set')).toBeInTheDocument();
}, 10000);

test('ticket sales end date after event start date', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Sales end date must be before event start date.')).toBeInTheDocument();
}, 10000);

