import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_commentOnArticle_setNotificationPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Clears user reading history successfully.', async () => {
  fetchMock.post('/api/clearHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Cleared')).toBeInTheDocument();
}, 10000);

test('Fails to clear user reading history.', async () => {
  fetchMock.post('/api/clearHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to clear history')).toBeInTheDocument();
}, 10000);

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

test('Sets notification preferences successfully.', async () => {
  fetchMock.post('/api/setNotificationPreferences', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preferences'), { target: { value: 'Email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Preferences Saved')).toBeInTheDocument();
}, 10000);

test('Fails to set notification preferences.', async () => {
  fetchMock.post('/api/setNotificationPreferences', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preferences'), { target: { value: 'Email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
}, 10000);
