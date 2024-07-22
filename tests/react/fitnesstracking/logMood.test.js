import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FitnessApp from './logMood';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

