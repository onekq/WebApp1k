import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromWishList_userNotifications_customerSupportTicketing_productRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Remove from Wish List success removes item from wish list (from removeFromWishList_userNotifications)', async () => {
  fetchMock.delete('/api/wishlist/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(fetchMock.calls('/api/wishlist/1').length).toBe(1);
  expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
}, 10000);

test('Remove from Wish List failure shows error message (from removeFromWishList_userNotifications)', async () => {
  fetchMock.delete('/api/wishlist/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(screen.getByText('Error removing from wish list')).toBeInTheDocument();
}, 10000);

test('User Notifications successfully displays notifications. (from removeFromWishList_userNotifications)', async () => {
  fetchMock.get('/api/notifications', { status: 200, body: { notifications: ['Notification 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification 1')).toBeInTheDocument();
}, 10000);

test('User Notifications fails and displays error message. (from removeFromWishList_userNotifications)', async () => {
  fetchMock.get('/api/notifications', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch notifications')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing success creates a new ticket (from customerSupportTicketing_productRatings)', async () => {
  fetchMock.post('/api/tickets', { id: 1, issue: 'Issue description' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket created')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing failure shows error message (from customerSupportTicketing_productRatings)', async () => {
  fetchMock.post('/api/tickets', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(screen.getByText('Error creating ticket')).toBeInTheDocument();
}, 10000);

test('Product Ratings successfully displays product ratings. (from customerSupportTicketing_productRatings)', async () => {
  fetchMock.get('/api/ratings', { status: 200, body: { ratings: ['Rating 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating 1')).toBeInTheDocument();
}, 10000);

test('Product Ratings fails and displays error message. (from customerSupportTicketing_productRatings)', async () => {
  fetchMock.get('/api/ratings', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch ratings')).toBeInTheDocument();
}, 10000);

