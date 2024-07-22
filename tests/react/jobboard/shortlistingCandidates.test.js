import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ShortlistCandidate from './shortlistingCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

