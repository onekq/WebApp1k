import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CMS from './analyzeKeywordDensity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully analyzes keyword density of a post', async () => {
  fetchMock.post('/api/keyword-density', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/keyword density analyzed successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to analyze keyword density of a post due to server error', async () => {
  fetchMock.post('/api/keyword-density', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/failed to analyze keyword density/i)).toBeInTheDocument();
}, 10000);

