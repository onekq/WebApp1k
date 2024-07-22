import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PredictIncome from './predictFutureIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully predicts future income based on past data', async () => {
  fetchMock.get('/api/income/predict', { status: 200, body: { prediction: 5000 } });

  await act(async () => {
    render(<MemoryRouter><PredictIncome /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Predicted income is $5000')).toBeInTheDocument();
}, 10000);

test('fails to predict future income based on past data', async () => {
  fetchMock.get('/api/income/predict', { status: 400, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><PredictIncome /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);

