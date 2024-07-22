import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './totalYogaDuration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should calculate total yoga duration successfully.', async () => {
  fetchMock.get('/api/yoga/duration', { status: 200, body: { totalDuration: '10 hours' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Total Duration: 10 hours')).toBeInTheDocument();
}, 10000);

test('should fail to calculate total yoga duration.', async () => {
  fetchMock.get('/api/yoga/duration', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Failed to calculate total duration.')).toBeInTheDocument();
}, 10000);