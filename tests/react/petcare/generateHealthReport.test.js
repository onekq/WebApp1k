import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './generateHealthReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generate health report successfully', async () => {
  fetchMock.get('/api/health-report', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Health report generated successfully')).toBeInTheDocument();
}, 10000);

test('Fail to generate health report with error', async () => {
  fetchMock.get('/api/health-report', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Failed to generate health report')).toBeInTheDocument(); // Error message
}, 10000);

