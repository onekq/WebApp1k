import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createActivity_logSleepHours';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can create a new fitness activity successfully.', async () => {
  fetchMock.post('/api/createActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Activity created successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when creating a new fitness activity fails.', async () => {
  fetchMock.post('/api/createActivity', { status: 500, body: { error: 'Failed to create activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Failed to create activity')).toBeInTheDocument();
}, 10000);

test('logs sleep hours successfully and displays hours in the list', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);