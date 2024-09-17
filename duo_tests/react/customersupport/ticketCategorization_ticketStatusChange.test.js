import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ticketCategorization_ticketStatusChange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('categorizes a ticket based on user input', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Technical' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets')[0][1].body).toContain('Technical');
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if categorizing a ticket fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Technical' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to submit ticket')).toBeInTheDocument();
}, 10000);

test('successfully changes the status of a ticket', async () => {
  fetchMock.put('/api/tickets/1/status', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Status updated successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if changing status fails', async () => {
  fetchMock.put('/api/tickets/1/status', 500);
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Failed to update status')).toBeInTheDocument();
}, 10000);