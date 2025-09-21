import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateRunningPace_logMood_monthlySummary';

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

test('User can log their mood after workouts successfully.', async () => {
  fetchMock.post('/api/logMood', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Mood logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging their mood fails.', async () => {
  fetchMock.post('/api/logMood', { status: 500, body: { error: 'Failed to log mood' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Failed to log mood')).toBeInTheDocument();
}, 10000);

test('User can view a summary of their fitness activities for the past month successfully.', async () => {
  fetchMock.get('/api/monthly-summary', { summary: 'Excellent progress' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-summary')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Excellent progress/)).toBeInTheDocument();
}, 10000);

test('User fails to view a summary of their fitness activities for the past month.', async () => {
  fetchMock.get('/api/monthly-summary', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-summary')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching summary/)).toBeInTheDocument();
}, 10000);
