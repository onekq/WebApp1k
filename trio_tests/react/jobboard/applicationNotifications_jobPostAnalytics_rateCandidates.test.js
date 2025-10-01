import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationNotifications_jobPostAnalytics_rateCandidates';

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

test('Employer can successfully view job post analytics.', async () => {
  fetchMock.get('/api/analytics', { views: 100, applications: 10 });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobPostAnalytics />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Views: 100')).toBeInTheDocument();
  expect(screen.getByText('Applications: 10')).toBeInTheDocument();
}, 10000);

test('Viewing job post analytics fails due to server error.', async () => {
  fetchMock.get('/api/analytics', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobPostAnalytics />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load analytics')).toBeInTheDocument();
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
