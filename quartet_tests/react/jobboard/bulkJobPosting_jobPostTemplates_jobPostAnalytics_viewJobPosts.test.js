import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_jobPostTemplates_jobPostAnalytics_viewJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully post multiple jobs via CSV. (from bulkJobPosting_jobPostTemplates)', async () => {
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

test('Posting multiple jobs via CSV fails due to server error. (from bulkJobPosting_jobPostTemplates)', async () => {
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

test('employers can successfully use templates for common job posts (from bulkJobPosting_jobPostTemplates)', async () => {
  fetchMock.get('/api/job/templates', [{ title: 'Software Engineer', description: 'Develop applications' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('employers see an error message if job post templates fail to load (from bulkJobPosting_jobPostTemplates)', async () => {
  fetchMock.get('/api/job/templates', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load job post templates')).toBeInTheDocument();
}, 10000);

test('Employer can successfully view job post analytics. (from jobPostAnalytics_viewJobPosts)', async () => {
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

test('Viewing job post analytics fails due to server error. (from jobPostAnalytics_viewJobPosts)', async () => {
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

test('allows job seekers to view detailed job posts successfully. (from jobPostAnalytics_viewJobPosts)', async () => {
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

test('shows an error when job posts cannot be viewed. (from jobPostAnalytics_viewJobPosts)', async () => {
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

