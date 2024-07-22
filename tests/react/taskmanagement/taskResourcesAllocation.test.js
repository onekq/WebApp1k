import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ResourceAllocation from './taskResourcesAllocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully allocates resources to a task.', async () => {
  fetchMock.post('/api/resource-allocation', { success: true });

  await act(async () => { render(<MemoryRouter><ResourceAllocation /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Resource allocated successfully')).toBeInTheDocument();
}, 10000);

test('fails to allocate resources to a task if server error.', async () => {
  fetchMock.post('/api/resource-allocation', 500);

  await act(async () => { render(<MemoryRouter><ResourceAllocation /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to allocate resource')).toBeInTheDocument();
}, 10000);

