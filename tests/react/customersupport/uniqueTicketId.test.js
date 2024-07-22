import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketSubmission from './uniqueTicketID';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('assigns a unique ID to each new ticket', async () => {
  fetchMock.post('/api/tickets', { id: '12345' });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket ID: 12345')).toBeInTheDocument();
}, 10000);

test('fails to assign a unique ID if submission fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.queryByText('Ticket ID:')).not.toBeInTheDocument();
}, 10000);

