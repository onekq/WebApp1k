import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectMilestoneAddition_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add Milestone to Project - success', async () => {
  fetchMock.post('/api/projects/milestone', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/milestone added successfully/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - failure', async () => {
  fetchMock.post('/api/projects/milestone', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/failed to add milestone/i)).toBeInTheDocument();
}, 10000);

test('should update task progress successfully.', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails.', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);