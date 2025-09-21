import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteIngredientSubstitution_deleteRecipeImage_filterRecipesByCuisine';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes ingredient substitutions from a recipe', async () => {
  fetchMock.delete('/recipes/1/substitutions/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Substitution deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete ingredient substitutions due to server error', async () => {
  fetchMock.delete('/recipes/1/substitutions/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete substitution')).toBeInTheDocument();
}, 10000);

test('successfully deletes an image from a recipe', async () => {
  fetchMock.delete('/recipes/1/image', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete an image from a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1/image', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - success', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', { recipes: [{ id: 3, title: 'Italian Pizza' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Italian Pizza')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - failure', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
