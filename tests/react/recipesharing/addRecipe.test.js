import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a recipe with all required fields', async () => {
  fetchMock.post('/recipes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'New Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added successfully')).toBeInTheDocument();
}, 10000);

test('fails to add a recipe due to missing required fields', async () => {
  fetchMock.post('/recipes', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
}, 10000);
