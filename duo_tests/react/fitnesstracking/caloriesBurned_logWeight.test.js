import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './caloriesBurned_logWeight';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('System calculates total calories burned in a week successfully.', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week.', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
}, 10000);

test('logs weight successfully and displays weight in the list', async () => {
  fetchMock.post('/api/log-weight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '70' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Weight logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log weight and displays an error message', async () => {
  fetchMock.post('/api/log-weight', { status: 400, body: { error: 'Invalid weight' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log weight.')).toBeInTheDocument();
}, 10000);