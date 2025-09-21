import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_editCookingTip_followUser';

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

test('successfully edits cooking tips in a recipe', async () => {
  fetchMock.put('/recipes/1/tips/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Tip'), { target: { value: 'Updated Tip' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tip updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit cooking tips due to server error', async () => {
  fetchMock.put('/recipes/1/tips/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update tip')).toBeInTheDocument();
}, 10000);

test('Successfully follow another user', async () => {
  fetchMock.post('/api/follow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('follow-message')).toBeInTheDocument();
}, 10000);

test('Fail to follow another user with error message', async () => {
  fetchMock.post('/api/follow-user', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
