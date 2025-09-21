import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnArticle_displayArticlesByPreferences_updateArticleMetadata';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('comments on an article successfully', async () => {
  fetchMock.post('/comment', 200);

  await act(async () => { render(<MemoryRouter><CommentOnArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment posted')).toBeInTheDocument();
}, 10000);

test('fails to comment on an article with error message', async () => {
  fetchMock.post('/comment', 500);

  await act(async () => { render(<MemoryRouter><CommentOnArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post comment')).toBeInTheDocument();
}, 10000);

test('displays articles based on user preferences successfully', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 200, body: [{ id: 5, title: 'Preferred News' }] });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferred News')).toBeInTheDocument();
}, 10000);

test('fails to display articles based on user preferences', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load preference-based articles')).toBeInTheDocument();
}, 10000);

test('Update article metadata successfully.', async () => {
  fetchMock.post('/api/update-article-metadata', { success: true });

  await act(async () => { render(<MemoryRouter><UpdateArticleMetadata /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Metadata updated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to update article metadata and display error.', async () => {
  fetchMock.post('/api/update-article-metadata', 500);

  await act(async () => { render(<MemoryRouter><UpdateArticleMetadata /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error updating metadata.")).toBeInTheDocument();
}, 10000);
