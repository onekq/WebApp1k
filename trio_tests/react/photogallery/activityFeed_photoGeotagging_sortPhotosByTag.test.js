import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './activityFeed_photoGeotagging_sortPhotosByTag';

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

test('should successfully add/edit geotags on a photo', async () => {
  fetchMock.post('/api/geotag', { id: 1, geotag: 'Paris' });

  await act(async () => { render(<MemoryRouter><GeotagPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Geotag added')).toBeInTheDocument();
}, 10000);

test('should fail to add/edit geotags on a photo with error message', async () => {
  fetchMock.post('/api/geotag', 404);

  await act(async () => { render(<MemoryRouter><GeotagPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add geotag')).toBeInTheDocument();
}, 10000);

test('should successfully sort photos by tag', async () => {
  fetchMock.get('/api/sort?tag=sunset', { photos: [{ id: 1, tag: 'sunset' }] });

  await act(async () => { render(<MemoryRouter><SortPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to sort photos by tag with error message', async () => {
  fetchMock.get('/api/sort?tag=sunset', 404);

  await act(async () => { render(<MemoryRouter><SortPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);
