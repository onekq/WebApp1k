import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupportTicketing_productRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Customer Support Ticketing success creates a new ticket', async () => {
  fetchMock.post('/api/tickets', { id: 1, issue: 'Issue description' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket created')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing failure shows error message', async () => {
  fetchMock.post('/api/tickets', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(screen.getByText('Error creating ticket')).toBeInTheDocument();
}, 10000);

test('Product Ratings successfully displays product ratings.', async () => {
  fetchMock.get('/api/ratings', { status: 200, body: { ratings: ['Rating 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating 1')).toBeInTheDocument();
}, 10000);

test('Product Ratings fails and displays error message.', async () => {
  fetchMock.get('/api/ratings', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch ratings')).toBeInTheDocument();
}, 10000);