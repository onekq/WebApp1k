import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './trackWaterIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('tracks water intake successfully and displays progress', async () => {
  fetchMock.get('/api/track-water-intake', { status: 200, body: { progress: 80 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Daily water intake progress: 80%')).toBeInTheDocument();
}, 10000);

test('fails to track water intake and displays an error message', async () => {
  fetchMock.get('/api/track-water-intake', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track water intake.')).toBeInTheDocument();
}, 10000);

