import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteIngredientSubstitution';

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

