import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logMeals';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('logs meals successfully and displays meals in the list', async () => {
  fetchMock.post('/api/log-meals', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter meal description'), { target: { value: 'Salad' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Meal')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Meal logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log meals and displays an error message', async () => {
  fetchMock.post('/api/log-meals', { status: 400, body: { error: 'Invalid meal description' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter meal description'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Meal')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log meal.')).toBeInTheDocument();
}, 10000);

