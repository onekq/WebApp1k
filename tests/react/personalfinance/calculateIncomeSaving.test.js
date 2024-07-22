import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import IncomeSaved from './calculateIncomeSaving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 200, body: { percentage: 20 } });

  await act(async () => {
    render(<MemoryRouter><IncomeSaved /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('20% of income saved!')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 400, body: { error: 'Error calculating' } });

  await act(async () => {
    render(<MemoryRouter><IncomeSaved /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error calculating')).toBeInTheDocument();
}, 10000);

