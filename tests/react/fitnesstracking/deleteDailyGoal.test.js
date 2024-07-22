import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteDailyGoal from './deleteDailyGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully delete a daily fitness goal', async () => {
  fetchMock.delete('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><DeleteDailyGoal goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when deleting a daily fitness goal fails', async () => {
  fetchMock.delete('/api/goals/daily/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><DeleteDailyGoal goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to delete goal/i)).toBeInTheDocument();
}, 10000);

