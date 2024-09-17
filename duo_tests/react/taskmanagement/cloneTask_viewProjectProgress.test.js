import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cloneTask_viewProjectProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should clone an existing task successfully.', async () => {
  fetchMock.post('/api/cloneTask', { status: 200, body: { id: 3, clonedFromId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Task cloned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when cloning task fails.', async () => {
  fetchMock.post('/api/cloneTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Failed to clone task.')).toBeInTheDocument();
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