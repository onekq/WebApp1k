import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_commentOnRecipe_deleteRecipeRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the average rating of a recipe', async () => {
  fetchMock.get('/recipe-rating', { rating: 4.5 });

  await act(async () => { render(<MemoryRouter><CalculateRecipeRatingsComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average rating: 4.5')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to calculate the average rating of a recipe', async () => {
  fetchMock.get('/recipe-rating', 500);

  await act(async () => { render(<MemoryRouter><CalculateRecipeRatingsComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate rating')).toBeInTheDocument();
}, 10000);

test('Successfully comment on a recipe', async () => {
  fetchMock.post('/api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Yummy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to comment on recipe with error message', async () => {
  fetchMock.post('/api/comment', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Yummy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully delete a recipe rating', async () => {
  fetchMock.delete('/api/delete-rating', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe rating with error message', async () => {
  fetchMock.delete('/api/delete-rating', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
