import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fileAttachments_restoreArchivedArticle_userResponseNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully attaches files to a ticket', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if attaching file fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to attach file')).toBeInTheDocument();
}, 10000);

test('successfully restores archived articles', async () => {
  fetchMock.post('path/to/api/article/restore', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('restore-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to restore archived articles with error message', async () => {
  fetchMock.post('path/to/api/article/restore', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('restore-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show success message.', async () => {
  fetchMock.post('/api/notify-user', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show error message when failed.', async () => {
  fetchMock.post('/api/notify-user', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notification failed')).toBeInTheDocument();
}, 10000);
