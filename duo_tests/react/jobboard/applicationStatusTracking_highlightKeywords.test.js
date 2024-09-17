import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationStatusTracking_highlightKeywords';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful application status tracking.', async () => {
  fetchMock.get('/status/123', { status: 'In Progress' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
}, 10000);

test('failure application status tracking.', async () => {
  fetchMock.get('/status/123', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status not found')).toBeInTheDocument();
}, 10000);

test('highlights keywords in job descriptions during search successfully.', async () => {
  fetchMock.get('/api/jobPosts?search=developer', [{ id: 1, title: 'Frontend Developer', description: 'Great developer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Great developer')).toBeInTheDocument();
}, 10000);

test('shows an error message when keyword highlighting fails.', async () => {
  fetchMock.get('/api/jobPosts?search=developer', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error highlighting keywords.')).toBeInTheDocument();
}, 10000);