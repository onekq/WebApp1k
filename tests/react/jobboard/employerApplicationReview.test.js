import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ApplicationReview from './employerApplicationReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully review applications.', async () => {
  fetchMock.get('/api/applications', { applications: [{ id: 1, name: 'John Doe' }] });

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Review application fails due to server error.', async () => {
  fetchMock.get('/api/applications', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load applications')).toBeInTheDocument();
}, 10000);

