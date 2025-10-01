import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editPhotoDetails_photoMetadataExtraction_viewPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('edits photo details successfully', async () => {
  fetchMock.put('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
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
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
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

test('extracts photo metadata correctly', async () => {
  fetchMock.post('/upload', { status: 200, body: { metadata: { date: '2021-01-01', location: 'Paris' } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Date: 2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Location: Paris/)).toBeInTheDocument();
}, 10000);

test('fails to extract photo metadata', async () => {
  fetchMock.post('/upload', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/metadata extraction failed/i)).toBeInTheDocument();
}, 10000);

test('views detailed information of a photo successfully', async () => {
  fetchMock.get('/photo/1', { status: 200, body: { title: 'Sunset', date: '2021-01-01', location: 'Beach' } });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Sunset/)).toBeInTheDocument();
  expect(screen.getByText(/2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Beach/)).toBeInTheDocument();
}, 10000);

test('fails to view detailed information of a photo', async () => {
  fetchMock.get('/photo/1', { status: 404 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details not found/i)).toBeInTheDocument();
}, 10000);
