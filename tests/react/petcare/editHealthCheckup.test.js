import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './editHealthCheckup';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Edit health checkup successfully', async () => {
  fetchMock.put('/api/health-checkups/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: 'Bi-Annual Checkup' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Health checkup updated')).toBeInTheDocument();
}, 10000);

test('Fail to edit health checkup with error', async () => {
  fetchMock.put('/api/health-checkups/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Failed to update health checkup')).toBeInTheDocument(); // Error message
}, 10000);