import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_jobAlerts_editJobPosts_employerVerification';

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

test('Editing an existing job post successfully (from editJobPosts_employerVerification)', async () => {
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

test('Editing an existing job post failure due to network error (from editJobPosts_employerVerification)', async () => {
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

test('employers can be successfully verified before allowing job postings (from editJobPosts_employerVerification)', async () => {
  fetchMock.post('/api/employer/verify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Employer verified successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if verification fails (from editJobPosts_employerVerification)', async () => {
  fetchMock.post('/api/employer/verify', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to verify employer')).toBeInTheDocument();
}, 10000);

