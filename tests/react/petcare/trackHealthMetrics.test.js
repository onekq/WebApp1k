import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './trackHealthMetrics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Track health metrics successfully', async () => {
  fetchMock.post('/api/health-metrics', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '10.2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Health metrics recorded successfully')).toBeInTheDocument();
}, 10000);

test('Fail to track health metrics with error', async () => {
  fetchMock.post('/api/health-metrics', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Failed to record health metrics')).toBeInTheDocument(); // Error message
}, 10000);

