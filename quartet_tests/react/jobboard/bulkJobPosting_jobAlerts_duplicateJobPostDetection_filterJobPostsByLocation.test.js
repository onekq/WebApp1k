import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_jobAlerts_duplicateJobPostDetection_filterJobPostsByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully post multiple jobs via CSV. (from bulkJobPosting_jobAlerts)', async () => {
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

test('Posting multiple jobs via CSV fails due to server error. (from bulkJobPosting_jobAlerts)', async () => {
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

test('allows job seekers to set up alerts for new jobs successfully. (from bulkJobPosting_jobAlerts)', async () => {
  fetchMock.post('/api/jobAlerts', { id: 1, criteria: 'developer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Job alert set successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when setting up alerts fails. (from bulkJobPosting_jobAlerts)', async () => {
  fetchMock.post('/api/jobAlerts', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error setting job alert.')).toBeInTheDocument();
}, 10000);

test('Duplicate job post detection works successfully. (from duplicateJobPostDetection_filterJobPostsByLocation)', async () => {
  fetchMock.post('/api/check-duplicate', { isDuplicate: false });

  await act(async () => {
    render(
      <MemoryRouter>
        <CheckDuplicateJobPost />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Check Duplicate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No duplicates found')).toBeInTheDocument();
}, 10000);

test('Duplicate job post detection fails due to server error. (from duplicateJobPostDetection_filterJobPostsByLocation)', async () => {
  fetchMock.post('/api/check-duplicate', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <CheckDuplicateJobPost />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Check Duplicate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to check for duplicates')).toBeInTheDocument();
}, 10000);

test('allows job seekers to filter job posts by location successfully. (from duplicateJobPostDetection_filterJobPostsByLocation)', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', [{ id: 1, title: 'Project Manager' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Project Manager')).toBeInTheDocument();
}, 10000);

test('shows an error message when filtering by location fails. (from duplicateJobPostDetection_filterJobPostsByLocation)', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error filtering job posts.')).toBeInTheDocument();
}, 10000);

