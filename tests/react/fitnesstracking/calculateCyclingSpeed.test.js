import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './calculateCyclingSpeed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should calculate cycling speed successfully.', async () => {
  fetchMock.post('/api/speed/calculate', { status: 200, body: { speed: '30 km/h' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '60' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-speed-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/speed/calculate')).toBe(true);
  expect(screen.getByText('Speed: 30 km/h')).toBeInTheDocument();
}, 10000);

test('should fail to calculate cycling speed.', async () => {
  fetchMock.post('/api/speed/calculate', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '60' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-speed-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/speed/calculate')).toBe(true);
  expect(screen.getByText('Failed to calculate speed.')).toBeInTheDocument();
}, 10000);

