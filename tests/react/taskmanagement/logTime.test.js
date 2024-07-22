import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskDetail from './logTime';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Log time spent on a task successfully.', async () => {
  fetchMock.post('/api/tasks/1/time', {
    timeLog: { id: 1, taskId: 1, hours: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><TaskDetail taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3 hours logged')).toBeInTheDocument();
}, 10000);

test('Fail to log time spent on a task when API returns 500.', async () => {
  fetchMock.post('/api/tasks/1/time', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskDetail taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log time.')).toBeInTheDocument();
}, 10000);

