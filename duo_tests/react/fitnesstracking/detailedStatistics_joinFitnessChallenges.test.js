import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './detailedStatistics_joinFitnessChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can view detailed statistics of a specific fitness activity successfully.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 200, body: { data: { calories: 500 } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('500 calories')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing detailed statistics fails.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 500, body: { error: 'Failed to fetch statistics' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
}, 10000);

test('should successfully join a fitness challenge', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
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
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to join/i)).toBeInTheDocument();
}, 10000);