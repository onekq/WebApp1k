import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_employerVerification_rejectingApplications_shareJobPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully post multiple jobs via CSV. (from bulkJobPosting_employerVerification)', async () => {
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

test('Posting multiple jobs via CSV fails due to server error. (from bulkJobPosting_employerVerification)', async () => {
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

test('employers can be successfully verified before allowing job postings (from bulkJobPosting_employerVerification)', async () => {
  fetchMock.post('/api/employer/verify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Employer verified successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if verification fails (from bulkJobPosting_employerVerification)', async () => {
  fetchMock.post('/api/employer/verify', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to verify employer')).toBeInTheDocument();
}, 10000);

test('Employer can successfully reject an application. (from rejectingApplications_shareJobPost)', async () => {
  fetchMock.post('/api/reject', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application rejected successfully')).toBeInTheDocument();
}, 10000);

test('Rejecting an application fails due to server error. (from rejectingApplications_shareJobPost)', async () => {
  fetchMock.post('/api/reject', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reject the application')).toBeInTheDocument();
}, 10000);

test('allows job seekers to share job posts via social media successfully. (from rejectingApplications_shareJobPost)', async () => {
  fetchMock.post('/api/share', { id: 1, jobId: 1 });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Share'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Job shared successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when sharing job posts via social media fails. (from rejectingApplications_shareJobPost)', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Share'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing job.')).toBeInTheDocument();
}, 10000);

