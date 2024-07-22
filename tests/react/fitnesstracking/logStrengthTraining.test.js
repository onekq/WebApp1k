import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FitnessApp from './logStrengthTraining';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can log a strength training activity successfully.', async () => {
  fetchMock.post('/api/logStrengthTraining', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('strength-training-type'), { target: { value: 'Weightlifting' } });
    fireEvent.click(screen.getByTestId('submit-strength-training'));
  });

  expect(fetchMock.called('/api/logStrengthTraining')).toBeTruthy();
  expect(screen.getByText('Strength training activity logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging a strength training activity fails.', async () => {
  fetchMock.post('/api/logStrengthTraining', { status: 500, body: { error: 'Failed to log activity' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('strength-training-type'), { target: { value: 'Weightlifting' } });
    fireEvent.click(screen.getByTestId('submit-strength-training'));
  });

  expect(fetchMock.called('/api/logStrengthTraining')).toBeTruthy();
  expect(screen.getByText('Failed to log activity')).toBeInTheDocument();
}, 10000);

