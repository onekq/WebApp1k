import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchJobPosts_setupApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('allows job seekers to search job posts by keyword successfully.', async () => {
  fetchMock.get('/api/jobPosts?search=developer', [{ id: 1, title: 'Frontend Developer' }]);

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
  expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
}, 10000);

test('shows an error message when job search fails.', async () => {
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
  expect(screen.getByText('Error searching job posts.')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully set up alerts for new jobs matching their criteria', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);