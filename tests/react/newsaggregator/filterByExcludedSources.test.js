import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import NewsPlatform from './filterByExcludedSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters articles by excluded sources successfully', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 200, body: [{ id: 4, title: 'Non-CNN News' }] });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-CNN News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded sources', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

