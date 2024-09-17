import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeExpenses_predictFutureExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('categorizes expenses successfully', async () => {
  fetchMock.post('/api/category', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to categorize expenses', async () => {
  fetchMock.post('/api/category', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding category.')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data.', async () => {
  fetchMock.post('/api/predict-expense', { status: 200, body: { success: true, prediction: 300 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Predicted future expense: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Predict future expenses based on past data.', async () => {
  fetchMock.post('/api/predict-expense', { status: 500, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);