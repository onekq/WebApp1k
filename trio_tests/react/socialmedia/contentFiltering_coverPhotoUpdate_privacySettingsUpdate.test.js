import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentFiltering_coverPhotoUpdate_privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filters posts by hashtags successfully.', async () => {
  fetchMock.post('/api/filter', {
    status: 200, body: [{ id: 1, content: 'Hashtag post' }]
  });

  await act(async () => {
    render(<MemoryRouter><FilterComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hashtag post')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid hashtag filter.', async () => {
  fetchMock.post('/api/filter', {
    status: 400, body: { message: 'Invalid hashtag' }
  });

  await act(async () => {
    render(<MemoryRouter><FilterComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid hashtag')).toBeInTheDocument();
}, 10000);

test('Cover photo update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { message: 'Cover photo updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><CoverPhotoUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cover photo updated')).toBeInTheDocument();
}, 10000);

test('Cover photo update fails with invalid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><CoverPhotoUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);

test('Privacy settings update succeeds', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { message: 'Privacy settings updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><PrivacySettingsUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'private' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Privacy settings updated')).toBeInTheDocument();
}, 10000);

test('Privacy settings update fails', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { error: 'Failed to update settings' }, status: 400 });

  await act(async () => { render(<MemoryRouter><PrivacySettingsUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);
