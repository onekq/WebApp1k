import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HelpDeskApp from './ticketReassignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Reassigning ticket to a different agent should show success message.', async () => {
  fetchMock.post('/api/reassign-ticket', { agent: 'Jane Doe' });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Reassigned to Jane Doe successfully')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show error message when failed.', async () => {
  fetchMock.post('/api/reassign-ticket', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket reassignment failed')).toBeInTheDocument();
}, 10000);

