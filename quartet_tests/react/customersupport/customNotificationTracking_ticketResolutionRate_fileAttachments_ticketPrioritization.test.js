import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationTracking_ticketResolutionRate_fileAttachments_ticketPrioritization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks custom notification delivery. (from customNotificationTracking_ticketResolutionRate)', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', { deliveryStatus: 'Success' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 10000);

test('Fails to track custom notification delivery. (from customNotificationTracking_ticketResolutionRate)', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery')).toBeInTheDocument();
}, 10000);

test('Successfully reports on ticket resolution rates. (from customNotificationTracking_ticketResolutionRate)', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 200,
    body: { success: true, data: { resolutionRate: 0.75 }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution Rate: 75%')).toBeInTheDocument();
}, 10000);

test('Fails to report on ticket resolution rates and shows error message. (from customNotificationTracking_ticketResolutionRate)', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully attaches files to a ticket (from fileAttachments_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if attaching file fails (from fileAttachments_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  await act(async () => { fireEvent.change(screen.getByLabelText('Attachment'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to attach file')).toBeInTheDocument();
}, 10000);

test('successfully sets ticket priority (from fileAttachments_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets')[0][1].body).toContain('High');
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if setting priority fails (from fileAttachments_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to set ticket priority')).toBeInTheDocument();
}, 10000);

