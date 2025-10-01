import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fileAttachments_slaPerformanceReporting_ticketStatusFilter';

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

test('Successfully reports on SLA performance.', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 200,
    body: { success: true, data: { slaPerformance: 'Good' }},
  });

  await act(async () => {
    render(<MemoryRouter><SLAPerformanceReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Performance: Good')).toBeInTheDocument();
}, 10000);

test('Fails to report on SLA performance and shows error message.', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><SLAPerformanceReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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
