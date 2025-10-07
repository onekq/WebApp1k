import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationWithLinkedIn_setupJobAlerts_bulkJobPosting_jobAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful LinkedIn application. (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application. (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully set up alerts for new jobs matching their criteria (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails (from applicationWithLinkedIn_setupJobAlerts)', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);

test('Employer can successfully post multiple jobs via CSV. (from bulkJobPosting_jobAlerts)', async () => {
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

test('Posting multiple jobs via CSV fails due to server error. (from bulkJobPosting_jobAlerts)', async () => {
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

test('allows job seekers to set up alerts for new jobs successfully. (from bulkJobPosting_jobAlerts)', async () => {
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

test('shows an error message when setting up alerts fails. (from bulkJobPosting_jobAlerts)', async () => {
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

