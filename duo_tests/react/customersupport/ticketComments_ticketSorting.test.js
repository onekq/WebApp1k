import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ticketComments_ticketSorting';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Adding comments to a ticket should show success message.', async () => {
  fetchMock.post('/api/add-comment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/add-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment addition failed')).toBeInTheDocument();
}, 10000);

test('sorts tickets by submission date', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', { status: 200, body: [{ id: 2, date: '2023-01-01' }, { id: 1, date: '2023-01-02' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  expect(screen.getByText('2023-01-02')).toBeInTheDocument();
}, 10000);

test('shows error if sorting tickets fails', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('Failed to sort tickets')).toBeInTheDocument();
}, 10000);