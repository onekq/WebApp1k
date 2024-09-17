import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './viewActivitySummary_viewAppUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Views activity summary successfully.', async () => {
  fetchMock.get('/activities/summary', { summary: 'Activity summary data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByText('Activity summary data')).toBeInTheDocument();
}, 10000);

test('Fails to view activity summary with error message.', async () => {
  fetchMock.get('/activities/summary', { status: 500, body: { message: 'Failed to fetch summary' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully views updates from the community', async () => {
  fetchMock.get('/api/community/updates', { status: 200, body: [{ id: 1, text: 'Community Update' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Community Update')).toBeInTheDocument();
}, 10000);

test('Fails to fetch community updates', async () => {
  fetchMock.get('/api/community/updates', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch updates')).toBeInTheDocument();
}, 10000);