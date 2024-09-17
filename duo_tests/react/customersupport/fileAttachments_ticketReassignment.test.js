import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fileAttachments_ticketReassignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully attaches files to a ticket', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if attaching file fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to attach file')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show success message.', async () => {
  fetchMock.post('/api/reassign-ticket', { agent: 'Jane Doe' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Reassigned to Jane Doe successfully')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show error message when failed.', async () => {
  fetchMock.post('/api/reassign-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket reassignment failed')).toBeInTheDocument();
}, 10000);