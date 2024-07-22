import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskApp from './requestTaskReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Request a review successfully', async () => {
  fetchMock.post('/request-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Review requested successfully')).toBeInTheDocument();
}, 10000);

test('Fail to request a review due to server error', async () => {
  fetchMock.post('/request-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Error requesting review')).toBeInTheDocument();
}, 10000);

