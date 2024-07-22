import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import GeotagPhoto from './photoGeotagging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

