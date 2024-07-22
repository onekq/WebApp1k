import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobListingPage from './bookmarkJobs';

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

