import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ticketSorting_ticketStatusFilter_uniqueTicketId';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('sorts tickets by submission date', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', { status: 200, body: [{ id: 2, date: '2023-01-01' }, { id: 1, date: '2023-01-02' }] });
  
  await act(async () => { render(<MemoryRouter><TicketSorting /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  expect(screen.getByText('2023-01-02')).toBeInTheDocument();
}, 10000);

test('shows error if sorting tickets fails', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSorting /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('Failed to sort tickets')).toBeInTheDocument();
}, 10000);

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
