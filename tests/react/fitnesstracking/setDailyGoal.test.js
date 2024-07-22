import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SetDailyGoal from './setDailyGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a daily fitness goal', async () => {
  fetchMock.post('/api/goals/daily', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetDailyGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a daily fitness goal fails', async () => {
  fetchMock.post('/api/goals/daily', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><SetDailyGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);

