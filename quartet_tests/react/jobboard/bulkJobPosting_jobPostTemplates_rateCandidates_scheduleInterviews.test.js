import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_jobPostTemplates_rateCandidates_scheduleInterviews';

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

test('Employer can successfully rate a candidate. (from rateCandidates_scheduleInterviews)', async () => {
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

test('Rating a candidate fails due to server error. (from rateCandidates_scheduleInterviews)', async () => {
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

test('Employer can successfully schedule an interview. (from rateCandidates_scheduleInterviews)', async () => {
  fetchMock.post('/api/schedule', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <ScheduleInterview />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Schedule'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interview scheduled successfully')).toBeInTheDocument();
}, 10000);

test('Scheduling an interview fails due to server error. (from rateCandidates_scheduleInterviews)', async () => {
  fetchMock.post('/api/schedule', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ScheduleInterview />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Schedule'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to schedule the interview')).toBeInTheDocument();
}, 10000);

