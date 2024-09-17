import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeByPreferences_displayArticlesByPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Categorize articles based on user preferences successfully.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

test('displays articles based on user preferences successfully', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 200, body: [{ id: 5, title: 'Preferred News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferred News')).toBeInTheDocument();
}, 10000);

test('fails to display articles based on user preferences', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load preference-based articles')).toBeInTheDocument();
}, 10000);