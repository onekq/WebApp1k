import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productAvailabilityNotification_rma_viewBiddingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Product availability notification succeeds.', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message.', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) success initiates RMA process', async () => {
  fetchMock.post('/api/orders/1/rma', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(fetchMock.calls('/api/orders/1/rma').length).toBe(1);
  expect(screen.getByText('RMA initiated')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) failure shows error message', async () => {
  fetchMock.post('/api/orders/1/rma', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(screen.getByText('Error initiating RMA')).toBeInTheDocument();
}, 10000);

test('successfully views bidding history', async () => {
  const mockHistory = [
    { id: 1, item: 'Item 1', bid: 100 },
    { id: 2, item: 'Item 2', bid: 200 },
  ];
  
  fetchMock.get('/api/bidding-history', { status: 200, body: mockHistory });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  mockHistory.forEach(({ item, bid }) => {
    expect(screen.getByText(item)).toBeInTheDocument();
    expect(screen.getByText(`$${bid}`)).toBeInTheDocument();
  });
}, 10000);

test('fails to view bidding history with an error message displayed.', async () => {
  fetchMock.get('/api/bidding-history', { status: 400, body: { error: 'Failed to load history' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history')).toBeInTheDocument();
}, 10000);
