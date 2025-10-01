import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationNotifications_rateCandidates_viewJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful application notifications.', async () => {
  fetchMock.get('/notifications', [{ message: 'Application Approved' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Approved')).toBeInTheDocument();
}, 10000);

test('failure application notifications.', async () => {
  fetchMock.get('/notifications', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Fetch Notifications')).toBeInTheDocument();
}, 10000);

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

test('allows job seekers to view detailed job posts successfully.', async () => {
  fetchMock.get('/api/jobPosts/123', { id: 123, title: 'Software Engineer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error when job posts cannot be viewed.', async () => {
  fetchMock.get('/api/jobPosts/123', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading job post.')).toBeInTheDocument();
}, 10000);
