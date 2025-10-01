import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './specialRequests_validateEventDescription_validateTicketQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Special requests are successfully recorded', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/special requests/i), { target: { value: 'Wheelchair access' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Special requests recording fails if not provided when specified', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/please specify special requests/i)).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid event description', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Valid Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for too long description', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'x'.repeat(1001) } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/description is too long/i)).toBeInTheDocument();
}, 10000);

test('ticket quantity within event capacity', async () => {
  fetchMock.post('/ticketQuantity', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketQuantity').length).toEqual(1);
  expect(screen.getByText('Ticket quantity set')).toBeInTheDocument();
}, 10000);

test('ticket quantity exceeds event capacity', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '1000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Quantity exceeds event capacity.')).toBeInTheDocument();
}, 10000);
