import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveReadingHistory_saveExcludedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Retrieves user reading history successfully.', async () => {
  fetchMock.get('/api/readingHistory', { status: 200, body: { history: ['Article 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article 1')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve user reading history.', async () => {
  fetchMock.get('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading history')).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);