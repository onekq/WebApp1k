import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './activityFeed_searchPhotosByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Activity Feed: success', async () => {
  fetchMock.get('/api/activityFeed', { body: [{ id: 1, action: 'uploaded', item: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-failure')).toBeInTheDocument();
}, 10000);

test('should successfully search photos by date', async () => {
  fetchMock.get('/api/search?date=2021-01-01', { photos: [{ id: 1, date: '2021-01-01' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: '2021-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by date with error message', async () => {
  fetchMock.get('/api/search?date=2021-01-01', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: '2021-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);