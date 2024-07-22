import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskApp from './userAvailability';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set user availability successfully', async () => {
  fetchMock.post('/set-availability', { status: 200, body: { available: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Availability set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user availability due to server error', async () => {
  fetchMock.post('/set-availability', { status: 500, body: { available: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Error setting availability')).toBeInTheDocument();
}, 10000);

