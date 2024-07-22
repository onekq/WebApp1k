import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateDailyCalorieIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculates daily calorie intake successfully and displays calories', async () => {
  fetchMock.get('/api/calculate-calories', { status: 200, body: { calories: 2000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total calories consumed: 2000')).toBeInTheDocument();
}, 10000);

test('fails to calculate daily calorie intake and displays an error message', async () => {
  fetchMock.get('/api/calculate-calories', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate daily calorie intake.')).toBeInTheDocument();
}, 10000);

