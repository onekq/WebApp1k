import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectBudgetSetup_projectMilestoneAddition_taskFilterUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Set Project Budget - success', async () => {
  fetchMock.post('/api/projects/budget', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Filter tasks by assigned user successfully.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', {
    tasks: [{ id: 3, title: 'Task 3', assignedUser: 'user1' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 3')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by assigned user when API returns 500.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);
