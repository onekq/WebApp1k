import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkJobs_editJobPosts_viewJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('allows job seekers to bookmark jobs for later successfully.', async () => {
  fetchMock.post('/api/bookmarks', { id: 1, jobId: 1 });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Bookmark'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Job bookmarked successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when bookmarking jobs fails.', async () => {
  fetchMock.post('/api/bookmarks', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Bookmark'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error bookmarking job.')).toBeInTheDocument();
}, 10000);

test('Editing an existing job post successfully', async () => {
  fetchMock.put('/api/job/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Senior Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job updated successfully!/i)).toBeInTheDocument();
}, 10000);

test('Editing an existing job post failure due to network error', async () => {
  fetchMock.put('/api/job/1', 500);

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Senior Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Failed to update job post/i)).toBeInTheDocument();
}, 10000);

test('allows job seekers to view detailed job posts successfully.', async () => {
  fetchMock.get('/api/jobPosts/123', { id: 123, title: 'Software Engineer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error when job posts cannot be viewed.', async () => {
  fetchMock.get('/api/jobPosts/123', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading job post.')).toBeInTheDocument();
}, 10000);
