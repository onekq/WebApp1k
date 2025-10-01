import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteArticle_deleteComment_saveExcludedSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete saved article successfully.', async () => {
  fetchMock.post('/api/delete-article', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article deleted successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to delete saved article and display error.', async () => {
  fetchMock.post('/api/delete-article', 500);

  await act(async () => { render(<MemoryRouter><DeleteArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error deleting article.")).toBeInTheDocument();
}, 10000);

test('deletes a comment successfully', async () => {
  fetchMock.delete('/comment/1', 200);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete a comment with error message', async () => {
  fetchMock.delete('/comment/1', 500);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);

test('saves user-excluded sources successfully', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded sources', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded sources')).toBeInTheDocument();
}, 10000);
