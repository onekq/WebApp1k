import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FitnessApp from './detailedStatistics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can view detailed statistics of a specific fitness activity successfully.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 200, body: { data: { calories: 500 } } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('500 calories')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing detailed statistics fails.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 500, body: { error: 'Failed to fetch statistics' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
}, 10000);