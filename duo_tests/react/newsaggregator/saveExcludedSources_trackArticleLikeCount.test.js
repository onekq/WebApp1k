import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveExcludedSources_trackArticleLikeCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Tracks article like count successfully.', async () => {
  fetchMock.post('/api/trackLike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Like Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article like count.', async () => {
  fetchMock.post('/api/trackLike', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track like count')).toBeInTheDocument();
}, 10000);