import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeByPreferences_filterByExcludedSources_shareArticleViaSocialMedia';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Categorize articles based on user preferences successfully.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

test('filters articles by excluded sources successfully', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 200, body: [{ id: 4, title: 'Non-CNN News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-CNN News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded sources', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('shares an article via social media successfully', async () => {
  fetchMock.post('/share/social-media', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared on social media')).toBeInTheDocument();
}, 10000);

test('fails to share an article via social media with error message', async () => {
  fetchMock.post('/share/social-media', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share on social media')).toBeInTheDocument();
}, 10000);
