import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dietaryRestrictions_validateEventDescription_validateTicketSalesStartDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Dietary restrictions are successfully submitted if provided', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/dietary restrictions/i), { target: { value: 'Vegetarian' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if dietary restrictions are not provided when required', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/please specify dietary restrictions/i)).toBeInTheDocument();
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

test('ticket sales start date before event start date', async () => {
  fetchMock.post('/ticketSalesStartDate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesStartDate'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketSalesStartDate').length).toEqual(1);
  expect(screen.getByText('Sales start date set')).toBeInTheDocument();
}, 10000);

test('ticket sales start date after event start date', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesStartDate'), { target: { value: '2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Sales start date must be before event start date.')).toBeInTheDocument();
}, 10000);
