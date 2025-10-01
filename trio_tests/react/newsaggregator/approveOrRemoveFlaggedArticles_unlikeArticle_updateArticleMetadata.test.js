import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './approveOrRemoveFlaggedArticles_unlikeArticle_updateArticleMetadata';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Approve or remove flagged articles successfully.', async () => {
  fetchMock.post('/api/moderate-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles moderated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to approve or remove flagged articles and display error.', async () => {
  fetchMock.post('/api/moderate-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error moderating articles.")).toBeInTheDocument();
}, 10000);

test('unlikes an article successfully', async () => {
  fetchMock.post('/unlike', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unliked')).toBeInTheDocument();
}, 10000);

test('fails to unlike an article with error message', async () => {
  fetchMock.post('/unlike', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unlike')).toBeInTheDocument();
}, 10000);

test('Update article metadata successfully.', async () => {
  fetchMock.post('/api/update-article-metadata', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Metadata updated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to update article metadata and display error.', async () => {
  fetchMock.post('/api/update-article-metadata', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error updating metadata.")).toBeInTheDocument();
}, 10000);
