import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayArticleMetadata_saveSelectedSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays article metadata successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, author: 'Author', date: 'Date', source: 'Source' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Author')).toBeInTheDocument();
  expect(screen.getByText('Date')).toBeInTheDocument();
  expect(screen.getByText('Source')).toBeInTheDocument();
}, 10000);

test('Fails to display article metadata', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load article metadata')).toBeInTheDocument();
}, 10000);

test('saves user-selected sources successfully', async () => {
  fetchMock.post('/api/save-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected sources', async () => {
  fetchMock.post('/api/save-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save sources')).toBeInTheDocument();
}, 10000);