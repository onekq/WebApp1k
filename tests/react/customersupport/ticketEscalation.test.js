import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HelpDeskApp from './ticketEscalation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Escalating tickets to higher support levels should show success message.', async () => {
  fetchMock.post('/api/escalate-ticket', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalated successfully')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show error message when failed.', async () => {
  fetchMock.post('/api/escalate-ticket', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalation failed')).toBeInTheDocument();
}, 10000);

