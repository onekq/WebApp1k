import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectMilestoneAddition_recurringTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add Milestone to Project - success', async () => {
  fetchMock.post('/api/projects/milestone', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/milestone added successfully/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - failure', async () => {
  fetchMock.post('/api/projects/milestone', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/failed to add milestone/i)).toBeInTheDocument();
}, 10000);

test('successfully sets a task to recur.', async () => {
  fetchMock.post('/api/task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set a task to recur if server error.', async () => {
  fetchMock.post('/api/task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set recurrence')).toBeInTheDocument();
}, 10000);