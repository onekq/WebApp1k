import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './continueListening_shufflePlay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully resumes playback where user left off', async () => {
  fetchMock.get('/api/continue-listening', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('resume-playback')).toBeInTheDocument();
}, 10000);

test('fails to resume playback due to session timeout', async () => {
  fetchMock.get('/api/continue-listening', 401);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session timed out. Please log in again.')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - success shows shuffle mode activated message', async () => {
  fetchMock.post('/api/shuffle-play', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shuffle mode activated')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - failure shows error message', async () => {
  fetchMock.post('/api/shuffle-play', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate shuffle mode')).toBeInTheDocument();
}, 10000);