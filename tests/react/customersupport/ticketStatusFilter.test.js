import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketStatusFilter from './ticketStatusFilter';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters tickets by status', async () => {
  fetchMock.get('/api/tickets?status=Open', { status: 200, body: [{ id: 1, status: 'Open' }] });
  
  await act(async () => { render(<MemoryRouter><TicketStatusFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status Filter'), { target: { value: 'Open' } }); });
  
  expect(fetchMock.calls('/api/tickets?status=Open').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
}, 10000);

test('shows error if filtering tickets fails', async () => {
  fetchMock.get('/api/tickets?status=Open', 500);
  
  await act(async () => { render(<MemoryRouter><TicketStatusFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status Filter'), { target: { value: 'Open' } }); });
  
  expect(fetchMock.calls('/api/tickets?status=Open').length).toBe(1);
  expect(screen.getByText('Failed to filter tickets')).toBeInTheDocument();
}, 10000);

