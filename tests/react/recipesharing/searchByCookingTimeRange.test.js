import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchByCookingTimeRange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure recipes can be searched by a range of cooking times - success', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', { recipes: [{ id: 6, title: 'Quick Breakfast' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Breakfast')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - failure', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
