import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './calculateRunningPace';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should calculate running pace successfully.', async () => {
  fetchMock.post('/api/pace/calculate', { status: 200, body: { pace: '5:00 min/km' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Pace: 5:00 min/km')).toBeInTheDocument();
}, 10000);

test('should fail to calculate running pace.', async () => {
  fetchMock.post('/api/pace/calculate', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Failed to calculate pace.')).toBeInTheDocument();
}, 10000);

