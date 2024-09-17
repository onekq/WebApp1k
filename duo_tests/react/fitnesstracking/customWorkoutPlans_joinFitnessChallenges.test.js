import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customWorkoutPlans_joinFitnessChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully create a custom workout plan', async () => {
  fetchMock.post('/api/workouts/custom', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/plan created successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when creating a custom workout plan fails', async () => {
  fetchMock.post('/api/workouts/custom', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to create plan/i)).toBeInTheDocument();
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