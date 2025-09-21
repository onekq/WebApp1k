import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkJobs_bulkJobPosting_saveJobSearches';

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

test('Employer can successfully post multiple jobs via CSV.', async () => {
  fetchMock.post('/api/bulk-post', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <BulkJobPost />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Upload CSV'), { target: { files: ['jobs.csv'] } });
    fireEvent.click(screen.getByText('Post Jobs'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Jobs posted successfully')).toBeInTheDocument();
}, 10000);

test('Posting multiple jobs via CSV fails due to server error.', async () => {
  fetchMock.post('/api/bulk-post', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <BulkJobPost />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Upload CSV'), { target: { files: ['jobs.csv'] } });
    fireEvent.click(screen.getByText('Post Jobs'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post jobs')).toBeInTheDocument();
}, 10000);

test('allows job seekers to save their search criteria successfully.', async () => {
  fetchMock.post('/api/savedSearches', { id: 1, criteria: 'developer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Save Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search saved successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when saving search criteria fails.', async () => {
  fetchMock.post('/api/savedSearches', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Save Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error saving search criteria.')).toBeInTheDocument();
}, 10000);
