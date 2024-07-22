import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recommendBasedOnPreferences';

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

