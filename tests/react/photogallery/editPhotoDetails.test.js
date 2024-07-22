import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PhotoEditComponent from './editPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('edits photo details successfully', async () => {
  fetchMock.put('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><PhotoEditComponent id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details updated/i)).toBeInTheDocument();
}, 10000);

test('fails to edit photo details', async () => {
  fetchMock.put('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><PhotoEditComponent id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update failed/i)).toBeInTheDocument();
}, 10000);

