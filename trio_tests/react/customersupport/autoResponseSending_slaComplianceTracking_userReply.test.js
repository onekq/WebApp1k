import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_slaComplianceTracking_userReply';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><AutoResponseSending /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><AutoResponseSending /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('Successfully tracks SLA compliance.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 200,
    body: { success: true, data: { complianceRate: 0.85 }},
  });

  await act(async () => {
    render(<MemoryRouter><SLAComplianceTracking /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Compliance: 85%')).toBeInTheDocument();
}, 10000);

test('Fails to track SLA compliance and shows error message.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><SLAComplianceTracking /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show success message.', async () => {
  fetchMock.post('/api/user-reply', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submitted successfully')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show error message when failed.', async () => {
  fetchMock.post('/api/user-reply', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submission failed')).toBeInTheDocument();
}, 10000);
