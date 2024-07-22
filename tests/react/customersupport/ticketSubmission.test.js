import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketSubmission from './ticketSubmission';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully submits a ticket with required fields filled', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error when submitting a ticket with missing fields', async () => {
  fetchMock.post('/api/tickets', { status: 400 });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);

