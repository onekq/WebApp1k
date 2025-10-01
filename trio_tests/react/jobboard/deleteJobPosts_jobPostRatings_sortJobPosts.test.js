import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteJobPosts_jobPostRatings_sortJobPosts';

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

test('job seekers can rate job posts successfully', async () => {
  fetchMock.post('/api/job/rate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 4 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit Rating/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Rating submitted successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if rating submission fails', async () => {
  fetchMock.post('/api/job/rate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 4 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit Rating/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

test('allows job seekers to sort job posts by date successfully.', async () => {
  fetchMock.get('/api/jobPosts?sort=date', [{ id: 1, title: 'QA Engineer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('QA Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error message when sorting job posts fails.', async () => {
  fetchMock.get('/api/jobPosts?sort=date', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sorting job posts.')).toBeInTheDocument();
}, 10000);
