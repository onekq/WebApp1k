import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePropertyImages_updatePropertyImages_addPropertyToListings_sharePropertyListings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully deletes property images. (from deletePropertyImages_updatePropertyImages)', async () => {
  fetchMock.delete('/api/properties/1/images/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-image-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete property images with error message. (from deletePropertyImages_updatePropertyImages)', async () => {
  fetchMock.delete('/api/properties/1/images/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-image-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

test('Successfully updates property images. (from deletePropertyImages_updatePropertyImages)', async () => {
  fetchMock.put('/api/properties/1/images/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Image updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update property images with error message. (from deletePropertyImages_updatePropertyImages)', async () => {
  fetchMock.put('/api/properties/1/images/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Failed to update image')).toBeInTheDocument();
}, 10000);

test('Successfully adds a property to the listings. (from addPropertyToListings_sharePropertyListings)', async () => {
  fetchMock.post('/api/properties', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Property added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add a property to the listings with error message. (from addPropertyToListings_sharePropertyListings)', async () => {
  fetchMock.post('/api/properties', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Failed to add property')).toBeInTheDocument();
}, 10000);

test('successfully shares property listings (from addPropertyToListings_sharePropertyListings)', async () => {
  fetchMock.post('/api/share', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('fails to share property listings and shows error message (from addPropertyToListings_sharePropertyListings)', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-error')).toBeInTheDocument();
}, 10000);

