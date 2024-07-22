import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FitnessApp from './historicalData';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can view historical data for past fitness activities successfully.', async () => {
  fetchMock.get('/api/historicalData', { status: 200, body: { data: [{ id: 1, name: 'Running' }] } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Running')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing historical data fails.', async () => {
  fetchMock.get('/api/historicalData', { status: 500, body: { error: 'Failed to fetch historical data' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Failed to fetch historical data')).toBeInTheDocument();
}, 10000);

