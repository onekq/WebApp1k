import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import NewsPlatform from './saveSelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('saves user-selected categories successfully', async () => {
  fetchMock.post('/api/save-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected categories', async () => {
  fetchMock.post('/api/save-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save categories')).toBeInTheDocument();
}, 10000);

