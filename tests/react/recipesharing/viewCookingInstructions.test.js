import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './viewCookingInstructions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Cooking Instructions successfully', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: [{ step: 'Preheat oven to 350F' }], status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preheat oven to 350F')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions failure shows error message', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: { message: 'Error fetching instructions' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching instructions')).toBeInTheDocument();
}, 10000);

