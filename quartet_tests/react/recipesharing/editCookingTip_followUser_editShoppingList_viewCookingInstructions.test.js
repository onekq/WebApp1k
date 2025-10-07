import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editCookingTip_followUser_editShoppingList_viewCookingInstructions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits cooking tips in a recipe (from editCookingTip_followUser)', async () => {
  fetchMock.put('/recipes/1/tips/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Tip'), { target: { value: 'Updated Tip' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tip updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit cooking tips due to server error (from editCookingTip_followUser)', async () => {
  fetchMock.put('/recipes/1/tips/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update tip')).toBeInTheDocument();
}, 10000);

test('Successfully follow another user (from editCookingTip_followUser)', async () => {
  fetchMock.post('/api/follow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('follow-message')).toBeInTheDocument();
}, 10000);

test('Fail to follow another user with error message (from editCookingTip_followUser)', async () => {
  fetchMock.post('/api/follow-user', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List successfully (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Shopping list updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list updated')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List failure shows error message (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Error updating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating shopping list')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions successfully (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: [{ step: 'Preheat oven to 350F' }], status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preheat oven to 350F')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions failure shows error message (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: { message: 'Error fetching instructions' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching instructions')).toBeInTheDocument();
}, 10000);

