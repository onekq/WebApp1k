import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recommendBasedOnPreferences_saveSelectedSources_shareArticleViaSocialMedia';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Recommends articles based on user preferences successfully.', async () => {
  fetchMock.get('/api/recommendations/preferences', { status: 200, body: { recommendations: ['Article B'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article B')).toBeInTheDocument();
}, 10000);

test('Fails to recommend articles based on user preferences.', async () => {
  fetchMock.get('/api/recommendations/preferences', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error retrieving recommendations')).toBeInTheDocument();
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

test('shares an article via social media successfully', async () => {
  fetchMock.post('/share/social-media', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared on social media')).toBeInTheDocument();
}, 10000);

test('fails to share an article via social media with error message', async () => {
  fetchMock.post('/share/social-media', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share on social media')).toBeInTheDocument();
}, 10000);
