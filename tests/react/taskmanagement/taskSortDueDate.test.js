import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskList from './taskSortDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sort tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', {
    tasks: [
      { id: 4, title: 'Task 4', dueDate: '2023-10-09' },
      { id: 5, title: 'Task 5', dueDate: '2023-10-10' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 4')).toBeInTheDocument();
  expect(screen.getByText('Task 5')).toBeInTheDocument();
}, 10000);

test('Fail to sort tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort tasks.')).toBeInTheDocument();
}, 10000);

