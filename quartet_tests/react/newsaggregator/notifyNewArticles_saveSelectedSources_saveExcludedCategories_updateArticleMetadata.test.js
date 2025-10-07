import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notifyNewArticles_saveSelectedSources_saveExcludedCategories_updateArticleMetadata';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Notifies user about new articles successfully. (from notifyNewArticles_saveSelectedSources)', async () => {
  fetchMock.post('/api/notifyNewArticles', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify New Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('New articles notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify user about new articles. (from notifyNewArticles_saveSelectedSources)', async () => {
  fetchMock.post('/api/notifyNewArticles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify New Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to notify')).toBeInTheDocument();
}, 10000);

test('saves user-selected sources successfully (from notifyNewArticles_saveSelectedSources)', async () => {
  fetchMock.post('/api/save-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected sources (from notifyNewArticles_saveSelectedSources)', async () => {
  fetchMock.post('/api/save-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save sources')).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully (from saveExcludedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories (from saveExcludedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);

test('Update article metadata successfully. (from saveExcludedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/update-article-metadata', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Metadata updated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to update article metadata and display error. (from saveExcludedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/update-article-metadata', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error updating metadata.")).toBeInTheDocument();
}, 10000);

