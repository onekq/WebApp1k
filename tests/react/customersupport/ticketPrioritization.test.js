import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketSubmission from './ticketPrioritization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets ticket priority', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets')[0][1].body).toContain('High');
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if setting priority fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to set ticket priority')).toBeInTheDocument();
}, 10000);

