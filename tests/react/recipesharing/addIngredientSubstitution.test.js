import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addIngredientSubstitution';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds ingredient substitutions to a recipe', async () => {
  fetchMock.post('/recipes/1/substitutions', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Substitution'), { target: { value: 'New Ingredient' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Ingredient substitution added')).toBeInTheDocument();
}, 10000);

test('fails to add ingredient substitutions due to invalid input', async () => {
  fetchMock.post('/recipes/1/substitutions', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid substitution')).toBeInTheDocument();
}, 10000);

