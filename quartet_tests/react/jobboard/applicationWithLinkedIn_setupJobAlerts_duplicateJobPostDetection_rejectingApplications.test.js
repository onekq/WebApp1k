import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationWithLinkedIn_setupJobAlerts_duplicateJobPostDetection_rejectingApplications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful LinkedIn application. (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application. (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully set up alerts for new jobs matching their criteria (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);

test('Duplicate job post detection works successfully. (from duplicateJobPostDetection_rejectingApplications)', async () => {
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

test('Duplicate job post detection fails due to server error. (from duplicateJobPostDetection_rejectingApplications)', async () => {
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

test('Employer can successfully reject an application. (from duplicateJobPostDetection_rejectingApplications)', async () => {
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

test('Rejecting an application fails due to server error. (from duplicateJobPostDetection_rejectingApplications)', async () => {
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

