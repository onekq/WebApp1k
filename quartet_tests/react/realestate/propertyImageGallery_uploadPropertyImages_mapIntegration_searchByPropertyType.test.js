import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './propertyImageGallery_uploadPropertyImages_mapIntegration_searchByPropertyType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays multiple images of a property in a gallery format (from propertyImageGallery_uploadPropertyImages)', async () => {
  fetchMock.get('/property/1/images', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('imageGallery')).toBeInTheDocument();
}, 10000);

test('fails to display image gallery due to network error (from propertyImageGallery_uploadPropertyImages)', async () => {
  fetchMock.get('/property/1/images', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load image gallery')).toBeInTheDocument();
}, 10000);

test('Successfully uploads property images. (from propertyImageGallery_uploadPropertyImages)', async () => {
  fetchMock.post('/api/properties/1/images', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images').length).toEqual(1);
  expect(screen.getByText('Images uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Fails to upload property images with error message. (from propertyImageGallery_uploadPropertyImages)', async () => {
  fetchMock.post('/api/properties/1/images', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images').length).toEqual(1);
  expect(screen.getByText('Failed to upload images')).toBeInTheDocument();
}, 10000);

test('shows the property location on a map (from mapIntegration_searchByPropertyType)', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error (from mapIntegration_searchByPropertyType)', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type successfully (from mapIntegration_searchByPropertyType)', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 200,
    body: [{ id: 1, type: 'apartment' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('apartment')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type fails (from mapIntegration_searchByPropertyType)', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

