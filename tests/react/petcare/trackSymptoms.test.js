import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './trackSymptoms';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Log and track symptoms successfully', async () => {
  fetchMock.post('/api/symptoms', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('symptoms-input'), { target: { value: 'Coughing' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Symptoms logged successfully')).toBeInTheDocument();
}, 10000);

test('Fail to log and track symptoms with error', async () => {
  fetchMock.post('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('symptoms-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to log symptoms')).toBeInTheDocument(); // Error message
}, 10000);
