import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationDeliveryTracking_ticketAssignment_trackArticleViews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully tracks delivery status of notifications.', async () => {
  fetchMock.get('/api/getDeliveryStatus', { status: 'Delivered' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delivered')).toBeInTheDocument();
}, 10000);

test('Fails to track delivery status of notifications.', async () => {
  fetchMock.get('/api/getDeliveryStatus', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery status')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show success message.', async () => {
  fetchMock.post('/api/assign-ticket', { agent: 'John Doe' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Assignment to John Doe successful')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show error message when failed.', async () => {
  fetchMock.post('/api/assign-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket assignment failed')).toBeInTheDocument();
}, 10000);

test('successfully tracks the number of views for an article', async () => {
  fetchMock.get('path/to/api/article/views', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('view-count')).toBeInTheDocument();
}, 10000);

test('fails to track the number of views for an article with error message', async () => {
  fetchMock.get('path/to/api/article/views', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
