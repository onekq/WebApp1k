import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketListDisplay from './ticketListDisplay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays a list of tickets with their current status', async () => {
  fetchMock.get('/api/tickets', { status: 200, body: [{ id: 1, status: 'Open' }, { id: 2, status: 'Resolved' }] });
  
  await act(async () => { render(<MemoryRouter><TicketListDisplay /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('Resolved')).toBeInTheDocument();
}, 10000);

test('shows error if fetching ticket list fails', async () => {
  fetchMock.get('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketListDisplay /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to fetch ticket list')).toBeInTheDocument();
}, 10000);

