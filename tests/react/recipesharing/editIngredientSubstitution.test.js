import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editIngredientSubstitution';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits ingredient substitutions in a recipe', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Substitution'), { target: { value: 'Updated Ingredient' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Substitution updated')).toBeInTheDocument();
}, 10000);

test('fails to edit ingredient substitutions due to server error', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update substitution')).toBeInTheDocument();
}, 10000);

