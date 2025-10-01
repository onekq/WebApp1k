import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByExcludedCategories_recommendBasedOnPreferences_sortByDateNewestFirst';

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

test('Recommends articles based on user preferences successfully.', async () => {
  fetchMock.get('/api/recommendations/preferences', { status: 200, body: { recommendations: ['Article B'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article B')).toBeInTheDocument();
}, 10000);

test('Fails to recommend articles based on user preferences.', async () => {
  fetchMock.get('/api/recommendations/preferences', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error retrieving recommendations')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (newest first) successfully', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 200, body: [{ id: 1, date: '2023-10-01' }] });

  await act(async () => { render(<MemoryRouter><App sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (newest first)', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);
