import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnRecipe_editCookingTip';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully comment on a recipe', async () => {
  fetchMock.post('/api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Yummy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to comment on recipe with error message', async () => {
  fetchMock.post('/api/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Yummy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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