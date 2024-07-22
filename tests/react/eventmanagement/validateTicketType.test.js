import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateTicketType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('selects ticket type successfully', async () => {
  fetchMock.post('/ticketType', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketType'), { target: { value: 'VIP' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketType').length).toEqual(1);
  expect(screen.getByText('Ticket type selected')).toBeInTheDocument();
}, 10000);

test('fails to select ticket type', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Please select a ticket type.')).toBeInTheDocument();
}, 10000);

