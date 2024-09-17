import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentNotification_fileAttachments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Notifying agent of new ticket assignment should show success message.', async () => {
  fetchMock.post('/api/notify-agent', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-agent')); });

  expect(fetchMock.calls('/api/notify-agent').length).toBe(1);
  expect(screen.getByText('Agent notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying agent of new ticket assignment should show error message when failed.', async () => {
  fetchMock.post('/api/notify-agent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-agent')); });

  expect(fetchMock.calls('/api/notify-agent').length).toBe(1);
  expect(screen.getByText('Agent notification failed')).toBeInTheDocument();
}, 10000);

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