import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskHistory from './viewTaskHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View change history of a task successfully.', async () => {
  fetchMock.get('/api/tasks/1/history', {
    history: [{ change: 'Changed status to completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskHistory taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Changed status to completed')).toBeInTheDocument();
}, 10000);

test('Fail to view change history of a task when API returns 500.', async () => {
  fetchMock.get('/api/tasks/1/history', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskHistory taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history.')).toBeInTheDocument();
}, 10000);

