import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectBudgetSetup_projectCustomWorkflows_recurringTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Set Project Budget - success', async () => {
  fetchMock.post('/api/projects/budget', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/budget set successfully/i)).toBeInTheDocument();
}, 10000);

test('Set Project Budget - failure', async () => {
  fetchMock.post('/api/projects/budget', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/failed to set budget/i)).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - success', async () => {
  fetchMock.post('/api/projects/workflows', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workflow name/i), { target: { value: 'Workflow1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /define workflow/i }));
  });

  expect(fetchMock.calls('/api/projects/workflows')).toHaveLength(1);
  expect(screen.getByText(/workflow defined successfully/i)).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - failure', async () => {
  fetchMock.post('/api/projects/workflows', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workflow name/i), { target: { value: 'Workflow1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /define workflow/i }));
  });

  expect(fetchMock.calls('/api/projects/workflows')).toHaveLength(1);
  expect(screen.getByText(/failed to define workflow/i)).toBeInTheDocument();
}, 10000);

test('successfully sets a task to recur.', async () => {
  fetchMock.post('/api/task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><TaskRecurrence /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set a task to recur if server error.', async () => {
  fetchMock.post('/api/task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><TaskRecurrence /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set recurrence')).toBeInTheDocument();
}, 10000);
