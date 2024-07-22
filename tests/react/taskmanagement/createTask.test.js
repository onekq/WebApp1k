import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully create a new task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 201, body: { id: 1, title: 'New Task', description: 'New task description' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New task description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to create a task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Failed to create task.')).toBeInTheDocument();
}, 10000);

