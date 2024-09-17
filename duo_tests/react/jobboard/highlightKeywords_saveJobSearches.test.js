import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './highlightKeywords_saveJobSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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