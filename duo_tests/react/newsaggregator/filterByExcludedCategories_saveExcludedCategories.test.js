import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByExcludedCategories_saveExcludedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters articles by excluded categories successfully', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 200, body: [{ id: 2, title: 'Non-Sports News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-Sports News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded categories', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);