import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskList from './taskFilterDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', {
    tasks: [{ id: 2, title: 'Task 2', dueDate: '2023-10-10' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 2')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);

