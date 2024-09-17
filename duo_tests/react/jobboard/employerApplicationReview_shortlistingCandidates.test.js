import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './employerApp_shortlistingCandidates';

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

test('Employer can successfully shortlist a candidate.', async () => {
  fetchMock.post('/api/shortlist', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate shortlisted successfully')).toBeInTheDocument();
}, 10000);

test('Shortlisting a candidate fails due to server error.', async () => {
  fetchMock.post('/api/shortlist', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to shortlist the candidate')).toBeInTheDocument();
}, 10000);