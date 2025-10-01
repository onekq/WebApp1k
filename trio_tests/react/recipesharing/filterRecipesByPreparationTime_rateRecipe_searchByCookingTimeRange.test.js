import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterRecipesByPreparationTime_rateRecipe_searchByCookingTimeRange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Ensure recipes can be filtered by preparation time - success', async () => {
  fetchMock.get('/api/recipes?prepTime=30', { recipes: [{ id: 4, title: 'Quick Salad' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Salad')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by preparation time - failure', async () => {
  fetchMock.get('/api/recipes?prepTime=30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Successfully rate a recipe', async () => {
  fetchMock.post('/api/rate-recipe', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to rate a recipe with error message', async () => {
  fetchMock.post('/api/rate-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - success', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', { recipes: [{ id: 6, title: 'Quick Breakfast' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Breakfast')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - failure', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
