import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventAnalytics_validateTicketQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays accurate event analytics', async () => {
  fetchMock.get('/api/event/analytics', { count: 100, sales: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Attendee count: 100')).toBeInTheDocument();
  expect(screen.getByText('Ticket sales: 50')).toBeInTheDocument();
}, 10000);

test('Displays error message when analytics data is inaccurate', async () => {
  fetchMock.get('/api/event/analytics', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to fetch event analytics')).toBeInTheDocument();
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