import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JoinChallenge from './joinFitnessChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully join a fitness challenge', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><JoinChallenge challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/joined successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when joining a fitness challenge fails', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><JoinChallenge challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to join/i)).toBeInTheDocument();
}, 10000);

