import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './viewActivitySummary_viewCommunityUpdates_likeCommunityUpdates_viewSymptomsLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Views activity summary successfully. (from viewActivitySummary_viewCommunityUpdates)', async () => {
  fetchMock.get('/activities/summary', { summary: 'Activity summary data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByText('Activity summary data')).toBeInTheDocument();
}, 10000);

test('Fails to view activity summary with error message. (from viewActivitySummary_viewCommunityUpdates)', async () => {
  fetchMock.get('/activities/summary', { status: 500, body: { message: 'Failed to fetch summary' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully views updates from the community (from viewActivitySummary_viewCommunityUpdates)', async () => {
  fetchMock.get('/api/community/updates', { status: 200, body: [{ id: 1, text: 'Community Update' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Community Update')).toBeInTheDocument();
}, 10000);

test('Fails to fetch community updates (from viewActivitySummary_viewCommunityUpdates)', async () => {
  fetchMock.get('/api/community/updates', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch updates')).toBeInTheDocument();
}, 10000);

test('Successfully likes a community update (from likeCommunityUpdates_viewSymptomsLog)', async () => {
  fetchMock.post('/api/community/like', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('Fails to like a community update (from likeCommunityUpdates_viewSymptomsLog)', async () => {
  fetchMock.post('/api/community/like', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like update')).toBeInTheDocument();
}, 10000);

test('View symptoms log successfully (from likeCommunityUpdates_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error (from likeCommunityUpdates_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
}, 10000);

