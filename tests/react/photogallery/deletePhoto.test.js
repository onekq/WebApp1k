import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PhotoManagementComponent from './deletePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes a photo successfully', async () => {
  fetchMock.delete('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><PhotoManagementComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a photo', async () => {
  fetchMock.delete('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><PhotoManagementComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
}, 10000);

