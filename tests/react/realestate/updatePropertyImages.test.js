import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UpdatePropertyImages from './updatePropertyImages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully updates property images.', async () => {
  fetchMock.put('/api/properties/1/images/1', { success: true });

  await act(async () => { render(<MemoryRouter><UpdatePropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Image updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update property images with error message.', async () => {
  fetchMock.put('/api/properties/1/images/1', 400);

  await act(async () => { render(<MemoryRouter><UpdatePropertyImages /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('image-upload'), { target: { files: [new File([], 'updated-image.jpg')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1/images/1').length).toEqual(1);
  expect(screen.getByText('Failed to update image')).toBeInTheDocument();
}, 10000);

