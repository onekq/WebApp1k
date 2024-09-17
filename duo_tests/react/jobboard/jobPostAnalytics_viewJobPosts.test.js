import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostAnalytics_viewJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully view job post analytics.', async () => {
  fetchMock.get('/api/analytics', { views: 100, applications: 10 });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobPostAnalytics />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Views: 100')).toBeInTheDocument();
  expect(screen.getByText('Applications: 10')).toBeInTheDocument();
}, 10000);

test('Viewing job post analytics fails due to server error.', async () => {
  fetchMock.get('/api/analytics', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobPostAnalytics />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load analytics')).toBeInTheDocument();
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