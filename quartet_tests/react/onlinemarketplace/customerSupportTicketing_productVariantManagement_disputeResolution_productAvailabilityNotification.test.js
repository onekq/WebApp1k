import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupportTicketing_productVariantManagement_disputeResolution_productAvailabilityNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Customer Support Ticketing success creates a new ticket (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/tickets', { id: 1, issue: 'Issue description' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket created')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing failure shows error message (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/tickets', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(screen.getByText('Error creating ticket')).toBeInTheDocument();
}, 10000);

test('Managing product variants succeeds. (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/products/1/variants', { status: 200, body: { id: 1, size: 'M', color: 'Red' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'M' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Variant added successfully')).toBeInTheDocument();
}, 10000);

test('Managing product variants fails with error message. (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/products/1/variants', { status: 400, body: { message: 'Invalid variant details' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Invalid variant details')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution success resolves the dispute (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/orders/1/dispute', { status: 'Resolved' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(fetchMock.calls('/api/orders/1/dispute').length).toBe(1);
  expect(screen.getByText('Dispute resolved')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution failure shows error message (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/orders/1/dispute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(screen.getByText('Error resolving dispute')).toBeInTheDocument();
}, 10000);

test('Product availability notification succeeds. (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

