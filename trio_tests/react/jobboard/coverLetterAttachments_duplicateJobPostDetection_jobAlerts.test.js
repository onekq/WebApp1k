import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './coverLetterAttachments_duplicateJobPostDetection_jobAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cover Letter Attached Successfully')).toBeInTheDocument();
}, 10000);

test('failure cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Attach Cover Letter')).toBeInTheDocument();
}, 10000);

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
