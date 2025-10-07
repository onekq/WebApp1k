import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './anonymousApplications_saveJobPostsAsDrafts_interviewNotifications_rateCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful anonymous application submission. (from anonymousApplications_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/applyAnonymous', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-anonymous-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Anonymous Application Successful')).toBeInTheDocument();
}, 10000);

test('failure anonymous application submission. (from anonymousApplications_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/applyAnonymous', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-anonymous-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit Anonymous Application')).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts successfully (from anonymousApplications_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/api/job/draft', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Job saved as draft successfully!/i)).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts failure due to network error (from anonymousApplications_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/api/job/draft', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Failed to save job as draft/i)).toBeInTheDocument();
}, 10000);

test('Candidate is successfully notified about the interview. (from interviewNotifications_rateCandidates)', async () => {
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

test('Notifying the candidate about the interview fails due to server error. (from interviewNotifications_rateCandidates)', async () => {
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

test('Employer can successfully rate a candidate. (from interviewNotifications_rateCandidates)', async () => {
  fetchMock.post('/api/rate', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <RateCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Rate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate rated successfully')).toBeInTheDocument();
}, 10000);

test('Rating a candidate fails due to server error. (from interviewNotifications_rateCandidates)', async () => {
  fetchMock.post('/api/rate', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <RateCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Rate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate the candidate')).toBeInTheDocument();
}, 10000);

