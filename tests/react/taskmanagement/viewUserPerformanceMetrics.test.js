import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskApp from './viewUserPerformanceMetrics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View user performance metrics successfully', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 200, body: { metrics: { tasksCompleted: 5 } } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Tasks completed: 5')).toBeInTheDocument();
}, 10000);

test('Fail to view user performance metrics due to server error', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 500, body: { metrics: null } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Error fetching performance metrics')).toBeInTheDocument();
}, 10000);

