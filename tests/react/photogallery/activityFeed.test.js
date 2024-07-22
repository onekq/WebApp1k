import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './activityFeed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Activity Feed: success', async () => {
  fetchMock.get('/api/activityFeed', { body: [{ id: 1, action: 'uploaded', item: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-1')).toBeInTheDocument();
}, 10000);

test('Activity Feed: failure', async () => {
  fetchMock.get('/api/activityFeed', { throws: new Error('Fetch Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-failure')).toBeInTheDocument();
}, 10000);