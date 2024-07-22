import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCookingTip';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds cooking tips to a recipe', async () => {
  fetchMock.post('/recipes/1/tips', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Cooking Tip'), { target: { value: 'New Tip' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tip added successfully')).toBeInTheDocument();
}, 10000);

test('fails to add cooking tips due to missing input', async () => {
  fetchMock.post('/recipes/1/tips', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Input cannot be empty')).toBeInTheDocument();
}, 10000);

