import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobListingPage from './filterJobPostsByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

