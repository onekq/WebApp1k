import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterJobPostsByCategory_jobAlerts_resubmitApplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('allows job seekers to filter job posts by categories successfully.', async () => {
  fetchMock.get('/api/jobPosts?category=IT', [{ id: 1, title: 'Backend Developer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'IT' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Backend Developer')).toBeInTheDocument();
}, 10000);

test('shows an error message when filtering by categories fails.', async () => {
  fetchMock.get('/api/jobPosts?category=IT', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'IT' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error filtering job posts.')).toBeInTheDocument();
}, 10000);

test('allows job seekers to set up alerts for new jobs successfully.', async () => {
  fetchMock.post('/api/jobAlerts', { id: 1, criteria: 'developer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Job alert set successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when setting up alerts fails.', async () => {
  fetchMock.post('/api/jobAlerts', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error setting job alert.')).toBeInTheDocument();
}, 10000);

test('successful application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Resubmitted Successfully')).toBeInTheDocument();
}, 10000);

test('failure application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Resubmit Application')).toBeInTheDocument();
}, 10000);
