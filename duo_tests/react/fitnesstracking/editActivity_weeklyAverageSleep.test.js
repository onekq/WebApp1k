import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_weeklyAverageSleep';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing fitness activity successfully.', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails.', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
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