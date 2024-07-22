import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PhotoDetailsComponent from './viewPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('views detailed information of a photo successfully', async () => {
  fetchMock.get('/photo/1', { status: 200, body: { title: 'Sunset', date: '2021-01-01', location: 'Beach' } });

  await act(async () => {
    render(<MemoryRouter><PhotoDetailsComponent id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Sunset/)).toBeInTheDocument();
  expect(screen.getByText(/2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Beach/)).toBeInTheDocument();
}, 10000);

test('fails to view detailed information of a photo', async () => {
  fetchMock.get('/photo/1', { status: 404 });

  await act(async () => {
    render(<MemoryRouter><PhotoDetailsComponent id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details not found/i)).toBeInTheDocument();
}, 10000);