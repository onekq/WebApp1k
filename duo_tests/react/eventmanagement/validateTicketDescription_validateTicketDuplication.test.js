import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateTicketDescription_validateTicketDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ticket description within limit', async () => {
  fetchMock.post('/ticketDescription', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A valid description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketDescription').length).toEqual(1);
  expect(screen.getByText('Ticket description set')).toBeInTheDocument();
}, 10000);

test('ticket description exceeds limit', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A'.repeat(300) } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Description exceeds character limit.')).toBeInTheDocument();
}, 10000);

test('allows ticket duplication', async () => {
  fetchMock.post('/duplicateTicket', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(fetchMock.calls('/duplicateTicket').length).toEqual(1);
  expect(screen.getByText('Ticket duplicated')).toBeInTheDocument();
}, 10000);

test('fails to duplicate ticket', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(screen.getByText('Unable to duplicate ticket.')).toBeInTheDocument();
}, 10000);