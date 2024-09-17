import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logTime_projectCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Log time spent on a task successfully.', async () => {
  fetchMock.post('/api/tasks/1/time', {
    timeLog: { id: 1, taskId: 1, hours: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
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
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
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

test('Create Project - success', async () => {
  fetchMock.post('/api/projects', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project - failure', async () => {
  fetchMock.post('/api/projects', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
}, 10000);