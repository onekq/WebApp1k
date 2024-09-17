import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createActivity_trackWorkoutIntensity';

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

test('tracks workout intensity successfully and displays intensity', async () => {
  fetchMock.get('/api/track-intensity', { status: 200, body: { intensity: 'Moderate' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout intensity: Moderate')).toBeInTheDocument();
}, 10000);

test('fails to track workout intensity and displays an error message', async () => {
  fetchMock.get('/api/track-intensity', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track workout intensity.')).toBeInTheDocument();
}, 10000);