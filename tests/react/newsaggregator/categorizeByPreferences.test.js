import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CategorizeByPreferences from './categorizeByPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Categorize articles based on user preferences successfully.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

