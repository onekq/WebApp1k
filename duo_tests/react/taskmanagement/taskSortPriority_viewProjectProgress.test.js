import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskSortPriority_viewProjectProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sort tasks by priority successfully.', async () => {
  fetchMock.get('/api/tasks?sort=priority', {
    tasks: [
      { id: 6, title: 'Task 6', priority: 'high' },
      { id: 7, title: 'Task 7', priority: 'low' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'priority' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 6')).toBeInTheDocument();
  expect(screen.getByText('Task 7')).toBeInTheDocument();
}, 10000);

test('Fail to sort tasks by priority when API returns 500.', async () => {
  fetchMock.get('/api/tasks?sort=priority', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'priority' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort tasks.')).toBeInTheDocument();
}, 10000);

test('View Project Progress - success', async () => {
  fetchMock.get('/api/projects/progress', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view progress/i }));
  });

  expect(fetchMock.calls('/api/projects/progress')).toHaveLength(1);
  expect(screen.getByText(/project progress/i)).toBeInTheDocument();
}, 10000);

test('View Project Progress - failure', async () => {
  fetchMock.get('/api/projects/progress', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view progress/i }));
  });

  expect(fetchMock.calls('/api/projects/progress')).toHaveLength(1);
  expect(screen.getByText(/failed to load project progress/i)).toBeInTheDocument();
}, 10000);