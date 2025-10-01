import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculatePropertyValue_propertyImageGallery_uploadPropertyImages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully calculates property value.', async () => {
  fetchMock.post('/api/properties/value', { value: 500000 });

  await act(async () => { render(<MemoryRouter><CalculatePropertyValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('$500,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate property value with error message.', async () => {
  fetchMock.post('/api/properties/value', 400);

  await act(async () => { render(<MemoryRouter><CalculatePropertyValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('Failed to calculate value')).toBeInTheDocument();
}, 10000);

test('displays multiple images of a property in a gallery format', async () => {
  fetchMock.get('/property/1/images', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('imageGallery')).toBeInTheDocument();
}, 10000);

test('fails to display image gallery due to network error', async () => {
  fetchMock.get('/property/1/images', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Gallery')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load image gallery')).toBeInTheDocument();
}, 10000);

test('Successfully uploads property images.', async () => {
  fetchMock.post('/api/properties/1/images', { success: true });

  await act(async () => { render(<MemoryRouter><UploadPropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images').length).toEqual(1);
  expect(screen.getByText('Images uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Fails to upload property images with error message.', async () => {
  fetchMock.post('/api/properties/1/images', 400);

  await act(async () => { render(<MemoryRouter><UploadPropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images').length).toEqual(1);
  expect(screen.getByText('Failed to upload images')).toBeInTheDocument();
}, 10000);
