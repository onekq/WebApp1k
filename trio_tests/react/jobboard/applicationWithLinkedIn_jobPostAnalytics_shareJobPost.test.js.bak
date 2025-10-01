import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationWithLinkedIn_jobPostAnalytics_shareJobPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
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

test('allows job seekers to share job posts via social media successfully.', async () => {
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

test('shows an error message when sharing job posts via social media fails.', async () => {
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
