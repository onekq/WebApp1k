import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editDailyGoal_setCalorieIntakeGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully edit a daily fitness goal', async () => {
  fetchMock.put('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 12000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/edit goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal edited successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when editing a daily fitness goal fails', async () => {
  fetchMock.put('/api/goals/daily/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 12000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/edit goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to edit goal/i)).toBeInTheDocument();
}, 10000);

test('should successfully set a calorie intake goal', async () => {
  fetchMock.post('/api/goals/calories', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a calorie intake goal fails', async () => {
  fetchMock.post('/api/goals/calories', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);