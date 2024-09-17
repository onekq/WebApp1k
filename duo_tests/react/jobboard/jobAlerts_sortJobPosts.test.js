import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobAlerts_sortJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('allows job seekers to sort job posts by date successfully.', async () => {
  fetchMock.get('/api/jobPosts?sort=date', [{ id: 1, title: 'QA Engineer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('QA Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error message when sorting job posts fails.', async () => {
  fetchMock.get('/api/jobPosts?sort=date', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sorting job posts.')).toBeInTheDocument();
}, 10000);