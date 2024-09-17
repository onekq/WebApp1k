import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectMilestoneAddition_viewUserPerformanceMetrics';

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

test('View user performance metrics successfully', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 200, body: { metrics: { tasksCompleted: 5 } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Tasks completed: 5')).toBeInTheDocument();
}, 10000);

test('Fail to view user performance metrics due to server error', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 500, body: { metrics: null } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Error fetching performance metrics')).toBeInTheDocument();
}, 10000);