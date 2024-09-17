import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTag_schedulePostForPublication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a tag successfully', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
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