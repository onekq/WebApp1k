import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkProductUpload_leaveProductReview_productAvailabilityNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Bulk product upload succeeds.', async () => {
  fetchMock.post('/api/bulk-upload', { status: 200, body: { message: 'Bulk upload successful' } });

  await act(async () => { render(<MemoryRouter><BulkUploadForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'sample.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Bulk upload successful')).toBeInTheDocument();
}, 10000);

test('Bulk product upload fails with error message.', async () => {
  fetchMock.post('/api/bulk-upload', { status: 400, body: { message: 'Invalid file format' } });

  await act(async () => { render(<MemoryRouter><BulkUploadForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'invalid_file.txt')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Invalid file format')).toBeInTheDocument();
}, 10000);

test('Leave Product Review successfully posts a review.', async () => {
  fetchMock.post('/api/reviews', { status: 200 });

  await act(async () => { render(<MemoryRouter><LeaveProductReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review posted')).toBeInTheDocument();
}, 10000);

test('Leave Product Review fails and displays error message.', async () => {
  fetchMock.post('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><LeaveProductReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post review')).toBeInTheDocument();
}, 10000);

test('Product availability notification succeeds.', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><NotifyForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message.', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><NotifyForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);
