import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateTicketDescription';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ticket description within limit', async () => {
  fetchMock.post('/ticketDescription', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A valid description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketDescription').length).toEqual(1);
  expect(screen.getByText('Ticket description set')).toBeInTheDocument();
}, 10000);

test('ticket description exceeds limit', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A'.repeat(300) } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Description exceeds character limit.')).toBeInTheDocument();
}, 10000);

