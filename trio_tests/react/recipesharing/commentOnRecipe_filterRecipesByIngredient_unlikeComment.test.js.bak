import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnRecipe_filterRecipesByIngredient_unlikeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Ensure recipes can be filtered by specific ingredients - success', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', { recipes: [{ id: 2, title: 'Tomato Pasta' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tomato Pasta')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - failure', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Successfully unlike a comment on a recipe', async () => {
  fetchMock.post('/api/unlike-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unlike-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to unlike a comment with error message', async () => {
  fetchMock.post('/api/unlike-comment', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
