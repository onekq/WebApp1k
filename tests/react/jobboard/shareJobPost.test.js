import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobListingPage from './shareJobPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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