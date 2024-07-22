import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './monthlySummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can view a summary of their fitness activities for the past month successfully.', async () => {
  fetchMock.get('/api/monthly-summary', { summary: 'Excellent progress' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-summary')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Excellent progress/)).toBeInTheDocument();
}, 10000);

test('User fails to view a summary of their fitness activities for the past month.', async () => {
  fetchMock.get('/api/monthly-summary', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-summary')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching summary/)).toBeInTheDocument();
}, 10000);

