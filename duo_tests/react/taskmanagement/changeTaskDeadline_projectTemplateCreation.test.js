import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './changeTaskDeadline_projectTemplateCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Change the due date of an existing task successfully.', async () => {
  fetchMock.put('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-11' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-11')).toBeInTheDocument();
}, 10000);

test('Fail to change the due date of an existing task when API returns 500.', async () => {
  fetchMock.put('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to change deadline.')).toBeInTheDocument();
}, 10000);

test('Create Project Template - success', async () => {
  fetchMock.post('/api/projects/template', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/template name/i), { target: { value: 'Template1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create template/i }));
  });

  expect(fetchMock.calls('/api/projects/template')).toHaveLength(1);
  expect(screen.getByText(/template created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project Template - failure', async () => {
  fetchMock.post('/api/projects/template', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/template name/i), { target: { value: 'Template1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create template/i }));
  });

  expect(fetchMock.calls('/api/projects/template')).toHaveLength(1);
  expect(screen.getByText(/failed to create template/i)).toBeInTheDocument();
}, 10000);