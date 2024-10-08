import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteJobPosts_jobPostCharacterLimits';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Validating character limits on job description and title successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(300) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Validating character limits failure due to exceeding limit', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(1001) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Description exceeds character limit/i)).toBeInTheDocument();
}, 10000);