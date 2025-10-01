import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateJobPostDetection_scheduleInterviews_shortlistingCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Duplicate job post detection works successfully.', async () => {
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

test('Duplicate job post detection fails due to server error.', async () => {
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

test('Employer can successfully schedule an interview.', async () => {
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

test('Scheduling an interview fails due to server error.', async () => {
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

test('Employer can successfully shortlist a candidate.', async () => {
  fetchMock.post('/api/shortlist', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate shortlisted successfully')).toBeInTheDocument();
}, 10000);

test('Shortlisting a candidate fails due to server error.', async () => {
  fetchMock.post('/api/shortlist', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to shortlist the candidate')).toBeInTheDocument();
}, 10000);
