import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeBookmark_saveExcludedSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('removes a bookmark from an article successfully', async () => {
  fetchMock.delete('/bookmark/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bookmark removed')).toBeInTheDocument();
}, 10000);

test('fails to remove a bookmark from an article with error message', async () => {
  fetchMock.delete('/bookmark/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove bookmark')).toBeInTheDocument();
}, 10000);

test('saves user-excluded sources successfully', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded sources', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded sources')).toBeInTheDocument();
}, 10000);