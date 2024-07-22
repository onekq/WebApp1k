import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CreateWorkoutPlan from './customWorkoutPlans';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully create a custom workout plan', async () => {
  fetchMock.post('/api/workouts/custom', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><CreateWorkoutPlan /></MemoryRouter>);
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
    render(<MemoryRouter><CreateWorkoutPlan /></MemoryRouter>);
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

