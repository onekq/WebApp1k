import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaDescription_deleteComment_schedulePostForPublication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a meta description to a post', async () => {
  fetchMock.post('/api/meta-description', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/meta description updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta description to a post due to server error', async () => {
  fetchMock.post('/api/meta-description', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/failed to update meta description/i)).toBeInTheDocument();
}, 10000);

test('successfully deletes a comment', async () => {
  fetchMock.delete('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a comment', async () => {
  fetchMock.delete('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to delete comment/i)).toBeInTheDocument();
}, 10000);

test('Success: schedule a post for future publication', async () => {
  fetchMock.post('/api/schedulePost', { status: 200, body: { id: 1, title: 'Scheduled Post', content: 'Some content', scheduledDate: '2023-10-10T12:00:00Z' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-10-10T12:00:00Z' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post scheduled successfully')).toBeInTheDocument();
}, 10000);

test('Failure: schedule a post with invalid date', async () => {
  fetchMock.post('/api/schedulePost', { status: 400, body: { error: 'Invalid date format' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: 'invalid-date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid date format')).toBeInTheDocument();
}, 10000);
