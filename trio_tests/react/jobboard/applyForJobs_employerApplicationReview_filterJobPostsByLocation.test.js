import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyForJobs_employerApplicationReview_filterJobPostsByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful job application.', async () => {
  fetchMock.post('/apply', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Successful')).toBeInTheDocument();
}, 10000);

test('failure job application.', async () => {
  fetchMock.post('/apply', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Apply')).toBeInTheDocument();
}, 10000);

test('Employer can successfully review applications.', async () => {
  fetchMock.get('/api/applications', { applications: [{ id: 1, name: 'John Doe' }] });

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Review application fails due to server error.', async () => {
  fetchMock.get('/api/applications', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load applications')).toBeInTheDocument();
}, 10000);

test('allows job seekers to filter job posts by location successfully.', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', [{ id: 1, title: 'Project Manager' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Project Manager')).toBeInTheDocument();
}, 10000);

test('shows an error message when filtering by location fails.', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error filtering job posts.')).toBeInTheDocument();
}, 10000);
