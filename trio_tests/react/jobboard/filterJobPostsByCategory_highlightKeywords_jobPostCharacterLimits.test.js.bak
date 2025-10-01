import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterJobPostsByCategory_highlightKeywords_jobPostCharacterLimits';

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

test('Validating character limits on job description and title successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(300) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Validating character limits failure due to exceeding limit', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(1001) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Description exceeds character limit/i)).toBeInTheDocument();
}, 10000);
