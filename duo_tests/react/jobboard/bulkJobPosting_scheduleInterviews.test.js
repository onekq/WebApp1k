import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkJobPosting_scheduleInterviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully post multiple jobs via CSV.', async () => {
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

test('Posting multiple jobs via CSV fails due to server error.', async () => {
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