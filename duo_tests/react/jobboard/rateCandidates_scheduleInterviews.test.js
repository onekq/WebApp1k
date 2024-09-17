import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateCandidates_scheduleInterviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully rate a candidate.', async () => {
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

test('Rating a candidate fails due to server error.', async () => {
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