import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './interviewNotifications_resubmitApplication_bulkJobPosting_employerVerification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Candidate is successfully notified about the interview. (from interviewNotifications_resubmitApplication)', async () => {
  fetchMock.post('/api/notify', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying the candidate about the interview fails due to server error. (from interviewNotifications_resubmitApplication)', async () => {
  fetchMock.post('/api/notify', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to notify the candidate')).toBeInTheDocument();
}, 10000);

test('successful application resubmission. (from interviewNotifications_resubmitApplication)', async () => {
  fetchMock.post('/resubmitApplication', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Resubmitted Successfully')).toBeInTheDocument();
}, 10000);

test('failure application resubmission. (from interviewNotifications_resubmitApplication)', async () => {
  fetchMock.post('/resubmitApplication', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Resubmit Application')).toBeInTheDocument();
}, 10000);

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

