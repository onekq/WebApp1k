import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PrivacySettingsUpdate from './privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

