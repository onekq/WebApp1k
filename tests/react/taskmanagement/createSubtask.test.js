import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createSubtask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should create a subtask under a parent task successfully.', async () => {
  fetchMock.post('/api/createSubtask', { status: 201, body: { id: 2, parentId: 1, title: 'New Subtask' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: 'New Subtask' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Subtask created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when creating subtask fails.', async () => {
  fetchMock.post('/api/createSubtask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Failed to create subtask.')).toBeInTheDocument();
}, 10000);

