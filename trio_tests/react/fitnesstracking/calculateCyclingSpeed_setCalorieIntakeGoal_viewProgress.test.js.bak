import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateCyclingSpeed_setCalorieIntakeGoal_viewProgress';

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

test('should successfully set a calorie intake goal', async () => {
  fetchMock.post('/api/goals/calories', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetCalorieGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a calorie intake goal fails', async () => {
  fetchMock.post('/api/goals/calories', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><SetCalorieGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);

test('should successfully view a graphical progress representation', async () => {
  fetchMock.get('/api/progress/graph', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/progress chart/i)).toBeInTheDocument();
}, 10000);

test('should show error message when viewing a graphical progress representation fails', async () => {
  fetchMock.get('/api/progress/graph', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to load progress/i)).toBeInTheDocument();
}, 10000);
