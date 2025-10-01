import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './caloriesBurned_deleteDailyGoal_editDailyGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('System calculates total calories burned in a week successfully.', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week.', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
}, 10000);

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

test('should successfully edit a daily fitness goal', async () => {
  fetchMock.put('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><EditDailyGoal goalId="123" /></MemoryRouter>);
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
    render(<MemoryRouter><EditDailyGoal goalId="123" /></MemoryRouter>);
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
