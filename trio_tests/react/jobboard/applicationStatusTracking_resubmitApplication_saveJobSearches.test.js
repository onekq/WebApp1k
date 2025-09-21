import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationStatusTracking_resubmitApplication_saveJobSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful application status tracking.', async () => {
  fetchMock.get('/status/123', { status: 'In Progress' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
}, 10000);

test('failure application status tracking.', async () => {
  fetchMock.get('/status/123', 404);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status not found')).toBeInTheDocument();
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

test('allows job seekers to save their search criteria successfully.', async () => {
  fetchMock.post('/api/savedSearches', { id: 1, criteria: 'developer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Save Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search saved successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when saving search criteria fails.', async () => {
  fetchMock.post('/api/savedSearches', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Save Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error saving search criteria.')).toBeInTheDocument();
}, 10000);
