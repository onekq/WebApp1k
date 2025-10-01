import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeActivity_logWeight_weeklyAverageSleep';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can categorize a fitness activity successfully.', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Category set successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when categorizing a fitness activity fails.', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 500, body: { error: 'Failed to set category' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Failed to set category')).toBeInTheDocument();
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

test('System calculates weekly average sleep hours successfully.', async () => {
  fetchMock.get('/api/average-sleep', { hours: 7 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/7 hours/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate weekly average sleep hours.', async () => {
  fetchMock.get('/api/average-sleep', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching sleep hours/)).toBeInTheDocument();
}, 10000);
