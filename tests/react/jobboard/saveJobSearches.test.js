import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobListingPage from './saveJobSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

