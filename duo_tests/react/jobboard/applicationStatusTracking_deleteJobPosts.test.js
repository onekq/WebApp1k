import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationStatusTracking_deleteJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful application status tracking.', async () => {
  fetchMock.get('/status/123', { status: 'In Progress' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
}, 10000);

test('failure application status tracking.', async () => {
  fetchMock.get('/status/123', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status not found')).toBeInTheDocument();
}, 10000);

test('Deleting a job post successfully', async () => {
  fetchMock.delete('/api/job/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job deleted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Deleting a job post failure due to not found error', async () => {
  fetchMock.delete('/api/job/1', 404);

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job not found/i)).toBeInTheDocument();
}, 10000);