import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkArticle_saveReadingHistory_setNotificationPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('bookmarks an article successfully', async () => {
  fetchMock.post('/bookmark', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Article bookmarked')).toBeInTheDocument();
}, 10000);

test('fails to bookmark an article with error message', async () => {
  fetchMock.post('/bookmark', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to bookmark')).toBeInTheDocument();
}, 10000);

test('Saves user reading history successfully.', async () => {
  fetchMock.post('/api/readingHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Saved')).toBeInTheDocument();
}, 10000);

test('Fails to save user reading history.', async () => {
  fetchMock.post('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save history')).toBeInTheDocument();
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
